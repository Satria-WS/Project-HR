import { useState, useEffect } from 'react';
import { supabase, auth } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthUser extends User {
  profile?: Profile | null;
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        
        // Check if we have auth tokens in URL hash (OAuth callback)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          console.log('Found access token in URL, processing OAuth callback...');
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) setLoading(false);
          return;
        }

        console.log('Initial session:', session);
        
        if (isMounted) {
          setSession(session);
          
          if (session?.user) {
            console.log('User found in session, loading profile...');
            const userWithProfile = await loadUserProfile(session.user);
            setUser(userWithProfile);
          } else {
            console.log('No user in session');
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (isMounted) setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!isMounted) return;
        
        setSession(session);
        
        if (session?.user) {
          console.log('User authenticated, loading profile...');
          const userWithProfile = await loadUserProfile(session.user);
          setUser(userWithProfile);
        } else {
          console.log('No user in session, clearing state');
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (user: User): Promise<AuthUser> => {
    try {
      console.log('Loading profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
      }

      // If no profile exists, create one
      if (!data) {
        console.log('No profile found, creating new profile...');
        const newProfile = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          console.log('Profile created successfully:', createdProfile);
          setProfile(createdProfile);
          return {
            ...user,
            profile: createdProfile
          };
        }
      }

      const userWithProfile: AuthUser = {
        ...user,
        profile: data
      };

      setProfile(data);
      return userWithProfile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return user as AuthUser;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await auth.signIn(email, password);
    setLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    setLoading(true);
    const result = await auth.signUp(email, password, metadata);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Starting logout process...');
      
      // Sign out from Supabase
      const { error } = await auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        // Continue with local cleanup even if Supabase signOut fails
      } else {
        console.log('Supabase signOut successful');
      }
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Clear any cached session data
      localStorage.removeItem('sb-uttiucryupaszmzfphhs-auth-token');
      
      console.log('Logout completed successfully');
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      
      // Even if there's an error, clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email!,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    setProfile(data);
    setUser({ ...user, profile: data });
    return data;
  };

  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  };
}

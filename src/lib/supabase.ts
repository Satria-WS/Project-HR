import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, metadata?: Record<string, unknown>) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signInWithGoogle: async () => {
    // Determine the correct redirect URL based on environment
    const isDevelopment = window.location.hostname === 'localhost';
    const baseUrl = isDevelopment 
      ? window.location.origin 
      : 'https://satria-ws.github.io';
    const basePath = isDevelopment ? '' : '/Project-HR';
    const redirectUrl = `${baseUrl}${basePath}/auth/callback`;
    
    console.log('Environment:', isDevelopment ? 'development' : 'production');
    console.log('OAuth redirect URL:', redirectUrl);
    
    // Note: OAuth configuration must be set up in Supabase dashboard
    // This will redirect to Google OAuth, then back to our callback URL
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
  },

  signOut: async () => {
    try {
      console.log('Initiating Supabase signOut...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
      }
      
      // Clear any Google OAuth state if applicable
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel();
          window.google.accounts.id.disableAutoSelect();
        } catch (googleError) {
          console.warn('Google signOut error:', googleError);
        }
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected signOut error:', error);
      return { error };
    }
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

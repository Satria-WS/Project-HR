import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class TeamService {
  // Get all team members/profiles
  static async getTeamMembers(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch team members: ${error.message}`);
    }

    return data || [];
  }

  // Add a new team member
  static async addTeamMember(member: ProfileInsert): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(member)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add team member: ${error.message}`);
    }

    return data;
  }

  // Update team member
  static async updateTeamMember(memberId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update team member: ${error.message}`);
    }

    return data;
  }

  // Remove team member
  static async removeTeamMember(memberId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', memberId);

    if (error) {
      throw new Error(`Failed to remove team member: ${error.message}`);
    }
  }

  // Get current user profile
  static async getCurrentUserProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Profile not found
      }
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    return data;
  }

  // Create or update user profile
  static async upsertUserProfile(profile: ProfileInsert): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert user profile: ${error.message}`);
    }

    return data;
  }
}

// Keep the old export for backward compatibility
export default new TeamService(); 
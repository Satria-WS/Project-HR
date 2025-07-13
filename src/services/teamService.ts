import axios from 'axios';
import type { TeamMember } from '@types/interfaces/TeamMember';

class TeamService {
  private baseUrl = '/api/team';

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }

  async addTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    try {
      const response = await axios.post(`${this.baseUrl}/members`, member);
      return response.data;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  async updateTeamMember(memberId: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const response = await axios.patch(`${this.baseUrl}/members/${memberId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }

  async removeTeamMember(memberId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/members/${memberId}`);
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }
}

export default new TeamService(); 
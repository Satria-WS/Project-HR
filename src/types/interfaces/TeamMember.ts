export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  joinDate: Date;
  status: 'active' | 'inactive' | 'pending';
} 
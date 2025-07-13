import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { User, Role } from '@interface/common';

export const useAuth = () => {
  const store = useProjectStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // This is a mock implementation. In a real app, you'd have proper authentication
    const user = store.users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserRole = (userId: string, newRole: Role) => {
    store.assignRole(userId, newRole);
  };

  return {
    user: currentUser,
    login,
    logout,
    updateUserRole,
  };
};
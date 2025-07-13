// src/components/modals/AddTeamMemberModal.tsx
import React, { useState } from 'react';
import { X, Plus, Users, Mail, UserPlus } from 'lucide-react';
import { useProjectStore } from '@store/projectStore';
import { Role } from '@interface/common';
import type { TeamMember } from '@interface/TeamMember';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTeamMemberModal({ isOpen, onClose }: AddTeamMemberModalProps) {
  const createUser = useProjectStore((state) => state.createUser);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Staff' as Role,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Create user
    createUser(formData);
    
    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      role: 'Staff',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl transform transition-all">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserPlus className="mr-3 text-indigo-600" />
            Add Team Member
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
            >
              <Users className="mr-2 text-indigo-500" />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Email Address */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
            >
              <Mail className="mr-2 text-indigo-500" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label 
              htmlFor="role" 
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
            >
              <UserPlus className="mr-2 text-indigo-500" />
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
              className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
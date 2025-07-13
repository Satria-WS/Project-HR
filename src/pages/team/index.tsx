// src/pages/team/index.tsx
import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { AddTeamMemberModal } from '@/components/modals/AddTeamMemberModal';

export function Team() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team</h1>
            <p className="text-gray-500">
              Manage your team members and their roles
            </p>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Member
          </button>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new team member.
              </p>
            </div>
          </div>
        </div>

        <AddTeamMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </div>
  );
}

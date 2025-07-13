// src/pages/Dashboard/QuickActions.tsx
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Plus,
  Users
} from 'lucide-react';
import { CreateTaskModal } from '@components/modals/CreateTaskModal';
import { CreateProjectModal } from '@components/modals/CreateProjectModal';
import { AddTeamMemberModal } from '@components/modals/AddTeamMemberModal';

export function QuickActions() {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen] = useState(false);

  const quickActions = [
    {
      name: 'New Task',
      description: 'Create a new task quickly',
      icon: CheckCircle2,
      onClick: () => setIsCreateTaskModalOpen(true),
    },
    {
      name: 'New Project',
      description: 'Start a new project',
      icon: Plus,
      onClick: () => setIsCreateProjectModalOpen(true),
    },
    {
      name: 'Add Team Member',
      description: 'Invite a new colleague',
      icon: Users,
      onClick: () => setIsAddTeamMemberModalOpen(true),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <div 
              key={action.name} 
              className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{action.name}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
              <button
                onClick={action.onClick}
                className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition-colors"
              >
                Create
              </button>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
      />
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
      />
      <AddTeamMemberModal
        isOpen={isAddTeamMemberModalOpen}
        onClose={() => setIsAddTeamMemberModalOpen(false)}
      />
    </>
  );
}
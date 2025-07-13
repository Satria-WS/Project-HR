// src/pages/layout/Dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { DashboardStats } from './_component/DashboardStats';
import { QuickActions } from './_component/QuickActions';
import { CreateTaskModal } from '@components/modals/CreateTaskModal';
import { CreateProjectModal } from '@components/modals/CreateProjectModal';
import { AddTeamMemberModal } from '@components/modals/AddTeamMemberModal';

export function Dashboard() {
  const { projects, tasks } = useProjectManagement();
  const [activeModals, setActiveModals] = useState({
    createTask: false,
    createProject: false,
    addTeamMember: false,
  });

  const handleNewButtonClick = () => {
    setActiveModals(prev => ({ ...prev, createProject: true }));
  };

  const closeModal = (modalName: keyof typeof activeModals) => {
    setActiveModals(prev => ({ ...prev, [modalName]: false }));
  };

  return (
    <div className="p-8">
      <div className="container mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-500">
              You have {projects.length} projects and {tasks.length} tasks
            </p>
          </div>
          
          <button 
            onClick={handleNewButtonClick}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Project
          </button>
        </header>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Statistics</h2>
          <DashboardStats projects={projects} tasks={tasks} />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <QuickActions />
        </section>

        {/* Modals */}
        <CreateTaskModal
          isOpen={activeModals.createTask}
          onClose={() => closeModal('createTask')}
        />
        <CreateProjectModal
          isOpen={activeModals.createProject}
          onClose={() => closeModal('createProject')}
        />
        <AddTeamMemberModal
          isOpen={activeModals.addTeamMember}
          onClose={() => closeModal('addTeamMember')}
        />
      </div>
    </div>
  );
}

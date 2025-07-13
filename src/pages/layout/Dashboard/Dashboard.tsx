// src/pages/layout/Dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { 
  Plus, 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { DashboardStats } from './_component/DashboardStats';
import { QuickActions } from './_component/QuickActions';
import { CreateTaskModal } from '@components/modals/CreateTaskModal';
import { CreateProjectModal } from '@components/modals/CreateProjectModal';
import { AddTeamMemberModal } from '@components/modals/AddTeamMemberModal';

// Navigation items
const NAVIGATION_ITEMS = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Projects', 
    href: '/projects', 
    icon: FolderKanban 
  },
  { 
    name: 'Tasks', 
    href: '/tasks', 
    icon: CheckSquare 
  },
  { 
    name: 'Team', 
    href: '/team', 
    icon: Users 
  },
];

export function Dashboard() {
  const location = useLocation();
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
    <div className="flex">
      {/* Sidebar Navigation */}
      <div className="w-64 min-h-screen bg-white border-r border-gray-200 py-8 px-4">
        <div className="mb-10 px-4">
          <h1 className="text-2xl font-bold text-gray-800">Project Hub</h1>
        </div>

        <nav className="space-y-2">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-2 rounded-md transition-colors duration-200
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
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
    </div>
  );
}
// src/pages/projects/[id].tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '@store/projectStore';
import { ArrowLeft, Calendar, Users, CheckCircle } from 'lucide-react';

export function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useProjectStore((state) => 
    state.projects.find(p => p.id === projectId)
  );

  if (!project) {
    return (
      <div className="p-8">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
            <p className="text-gray-500 mt-2">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600">{project.description}</p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${
              project.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Team Members</p>
                    <p className="text-sm text-gray-600">
                      {project.teamMembers?.length || 0} members
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CheckCircle className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Progress</p>
                    <p className="text-sm text-gray-600">In progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Add Task
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Invite Member
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

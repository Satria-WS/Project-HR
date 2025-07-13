// src/components/layout/RecentProjects.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, ChevronDown, ChevronUp } from 'lucide-react';
import { useProjectStore } from '@store/projectStore';

export function RecentProjects() {
  const [isExpanded, setIsExpanded] = useState(true);
  const projects = useProjectStore((state) => state.projects);

  // Sort projects by creation date and take the most recent 5
  const recentProjects = projects
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // If no projects, return null to completely hide the section
  if (recentProjects.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm">
      <div 
        className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Recent Projects
        </h3>
        <button className="text-gray-400 hover:text-gray-600">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="pb-2">
          <div className="space-y-1">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block group"
              >
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group cursor-pointer">
                  <FolderKanban className="w-4 h-4 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <div className="flex-grow flex justify-between items-center">
                    <span className="truncate">{project.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Optional: Add a context menu or more actions
export function RecentProjectsWithActions() {
  const [isExpanded, setIsExpanded] = useState(true);
  const projects = useProjectStore((state) => state.projects);
  const deleteProject = useProjectStore((state) => state.deleteProject);

  const recentProjects = projects
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (recentProjects.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div 
        className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">
            Recent Projects
          </h3>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {recentProjects.length}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="pb-2">
          <div className="space-y-1">
            {recentProjects.map((project) => (
              <div 
                key={project.id} 
                className="group"
              >
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <FolderKanban className="w-4 h-4 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <Link 
                    to={`/projects/${project.id}`} 
                    className="flex-grow flex justify-between items-center"
                  >
                    <span className="truncate">{project.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.confirm(`Are you sure you want to delete project "${project.name}"?`)) {
                          deleteProject(project.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
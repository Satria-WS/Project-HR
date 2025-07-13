import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { 
  Calendar,
  Users,
  Clock,
  MessageSquare,
  FileText,
  BarChart2,
  Settings,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function ProjectDetails() {
  const { projectId } = useParams();
  const project = useProjectStore((state) => 
    state.projects.find(p => p.id === projectId)
  );
  const tasks = useProjectStore((state) => 
    state.tasks.filter(t => t.projectId === projectId)
  );

  const [activeTab, setActiveTab] = useState('overview');

  if (!project) {
    return <div>Project not found</div>;
  }

  const stats = [
    {
      name: 'Total Tasks',
      value: tasks.length,
      icon: FileText,
    },
    {
      name: 'Completed Tasks',
      value: tasks.filter(t => t.status === 'Done').length,
      icon: CheckCircle2,
    },
    {
      name: 'Days Remaining',
      value: Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      icon: Calendar,
    },
    {
      name: 'Team Members',
      value: project.teamIds.length,
      icon: Users,
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart2 },
    { id: 'timeline', name: 'Timeline', icon: Clock },
    { id: 'files', name: 'Files', icon: FileText },
    { id: 'discussions', name: 'Discussions', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {project.name}
            </h2>
            <span className={`ml-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{project.description}</p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Timeline */}
      {activeTab === 'timeline' && (
        <div className="mt-8 flow-root">
          <ul className="-mb-8">
            {tasks.map((task, taskIdx) => (
              <li key={task.id}>
                <div className="relative pb-8">
                  {taskIdx !== tasks.length - 1 ? (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`
                        h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                        ${task.status === 'Done' ? 'bg-green-500' : 'bg-gray-400'}
                      `}>
                        {task.status === 'Done' ? (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-white" />
                        )}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{task.title}</span>
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500">{task.description}</p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={task.dueDate}>
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
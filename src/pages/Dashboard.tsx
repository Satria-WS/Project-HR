import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  Plus,
  Users,
  MessageCircle,
  Phone,
  Video,
  UserPlus
} from 'lucide-react';
import { CreateTaskModal } from '../components/modals/CreateTaskModal';
import { CreateProjectModal } from '../components/modals/CreateProjectModal';
import { AddTeamMemberModal } from '../components/modals/AddTeamMemberModal';
import { useProjectStore } from '../store/projectStore';

export function Dashboard() {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen] = useState(false);
  
  const users = useProjectStore((state) => state.users);

  const stats = [
    { name: 'Active Projects', value: '12', icon: Clock, color: 'text-blue-600' },
    { name: 'Completed Tasks', value: '89', icon: CheckCircle2, color: 'text-green-600' },
    { name: 'Pending Tasks', value: '23', icon: AlertCircle, color: 'text-yellow-600' },
    { name: 'Project Progress', value: '67%', icon: TrendingUp, color: 'text-purple-600' },
  ];

  const quickActions = [
    {
      name: 'New Task',
      description: 'Create a new task',
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
      description: 'Invite a new team member',
      icon: Plus,
      onClick: () => setIsAddTeamMemberModalOpen(true),
    },
  ];

  // Mock online status for demo purposes
  const getOnlineStatus = (userId: string) => {
    const statuses = ['online', 'busy', 'away', 'offline'];
    const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return statuses[hash % statuses.length];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'busy':
        return 'Busy';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const onlineMembers = users.filter(user => ['online', 'busy', 'away'].includes(getOnlineStatus(user.id)));
  const offlineMembers = users.filter(user => getOnlineStatus(user.id) === 'offline');

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.name}
              onClick={action.onClick}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <Icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{action.name}</p>
                <p className="truncate text-sm text-gray-500">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
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

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Person on Board Panel */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Person on Board</h3>
                    <p className="text-blue-100 text-sm">
                      {onlineMembers.length} online • {users.length} total
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddTeamMemberModalOpen(true)}
                  className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
                  title="Add New Member"
                >
                  <UserPlus className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Online Members */}
              {onlineMembers.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Active Now ({onlineMembers.length})
                  </h4>
                  <div className="space-y-3">
                    {onlineMembers.map((member) => {
                      const status = getOnlineStatus(member.id);
                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                              />
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(status)} rounded-full ring-2 ring-white`}></div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {member.name}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{member.role}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className={`text-xs font-medium ${
                                  status === 'online' ? 'text-green-600' :
                                  status === 'busy' ? 'text-red-600' :
                                  status === 'away' ? 'text-yellow-600' :
                                  'text-gray-500'
                                }`}>
                                  {getStatusText(status)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                              title="Send Message"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
                              title="Call"
                            >
                              <Phone className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
                              title="Video Call"
                            >
                              <Video className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Offline Members */}
              {offlineMembers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Offline ({offlineMembers.length})
                  </h4>
                  <div className="space-y-2">
                    {offlineMembers.slice(0, 3).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-3 p-2 rounded-lg opacity-60"
                      >
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-8 w-8 rounded-full object-cover grayscale"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gray-400 rounded-full ring-2 ring-white"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-600 truncate">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.role}</p>
                        </div>
                      </div>
                    ))}
                    {offlineMembers.length > 3 && (
                      <div className="text-center pt-2">
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          +{offlineMembers.length - 3} more offline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add Member Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsAddTeamMemberModalOpen(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite New Member
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          Website Redesign completed
                        </p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          New task assigned: Mobile App Update
                        </p>
                        <p className="text-sm text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          Sarah Chen joined the team
                        </p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="h-6 w-6 text-red-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          Q1 Report Submission
                        </p>
                        <p className="text-sm text-red-600 font-medium">Due in 2 days</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="h-6 w-6 text-orange-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          Client Meeting Preparation
                        </p>
                        <p className="text-sm text-orange-600 font-medium">Due in 5 days</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          Mobile App Beta Release
                        </p>
                        <p className="text-sm text-yellow-600 font-medium">Due in 1 week</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
}
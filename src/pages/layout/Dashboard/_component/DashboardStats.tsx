// src/pages/layout/Dashboard/DashboardStats.tsx
import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp 
} from 'lucide-react';
import { Project, Task } from '@/interface/common';

// Define prop types
interface DashboardStatsProps {
  projects: Project[];
  tasks: Task[];
}

export function DashboardStats({ projects, tasks }: DashboardStatsProps) {
  const calculateStats = () => {
    const projectStatusCounts = {
      total: projects.length,
      active: projects.filter(p => p.status === 'Active').length,
      completed: projects.filter(p => p.status === 'Completed').length
    };

    const taskStatusCounts = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Done').length,
      pending: tasks.filter(t => t.status !== 'Done').length
    };

    return [
      { 
        name: 'Total Projects', 
        value: projectStatusCounts.total.toString(), 
        icon: TrendingUp, 
        color: 'text-blue-600' 
      },
      { 
        name: 'Active Projects', 
        value: projectStatusCounts.active.toString(), 
        icon: Clock, 
        color: 'text-green-600' 
      },
      { 
        name: 'Completed Tasks', 
        value: taskStatusCounts.completed.toString(), 
        icon: CheckCircle2, 
        color: 'text-indigo-600' 
      },
      { 
        name: 'Pending Tasks', 
        value: taskStatusCounts.pending.toString(), 
        icon: AlertCircle, 
        color: 'text-yellow-600' 
      },
    ];
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white shadow rounded-lg p-6 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Icon className={`h-6 w-6 mr-3 ${stat.color}`} />
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
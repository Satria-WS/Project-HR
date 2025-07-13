import React, { useState } from 'react';
import { Plus, List, Grid, Calendar as CalendarIcon } from 'lucide-react';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { useProjectStore } from '@store/projectStore';

export function Tasks() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const tasks = useProjectStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'To Do').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done').length,
  };

  const renderListView = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => {
          const project = projects.find(p => p.id === task.projectId);
          const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
          
          return (
            <li key={task.id} className={`px-6 py-4 hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'Done' ? 'bg-green-500' :
                    task.status === 'In Progress' ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`} />
                  <div>
                    <h3 className={`text-sm font-medium ${
                      task.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {project?.name} • Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'Done' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const renderCalendarView = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="text-center py-12">
        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Calendar View</h3>
        <p className="mt-1 text-sm text-gray-500">
          Calendar view is coming soon. Use Kanban or List view for now.
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Tasks
          </h2>
          <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
            <span>{taskStats.total} total</span>
            <span>{taskStats.todo} to do</span>
            <span>{taskStats.inProgress} in progress</span>
            <span>{taskStats.done} completed</span>
            {taskStats.overdue > 0 && (
              <span className="text-red-600 font-medium">{taskStats.overdue} overdue</span>
            )}
          </div>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          {/* View Mode Toggle */}
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'kanban'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium border-t border-b ${
                viewMode === 'list'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
                viewMode === 'calendar'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Task View */}
      <div className="mt-8">
        {viewMode === 'kanban' && <KanbanBoard />}
        {viewMode === 'list' && renderListView()}
        {viewMode === 'calendar' && renderCalendarView()}
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
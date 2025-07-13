import React, { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Task, Status } from '../../types';
import { Clock, AlertCircle, CheckCircle2, Plus, Filter, Search } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { EditTaskModal } from './EditTaskModal';
import { CreateTaskModal } from './CreateTaskModal';

const COLUMNS: { id: Status; name: string; color: string }[] = [
  { id: 'To Do', name: 'To Do', color: 'bg-gray-100' },
  { id: 'In Progress', name: 'In Progress', color: 'bg-blue-100' },
  { id: 'Done', name: 'Done', color: 'bg-green-100' },
];

export function KanbanBoard() {
  const tasks = useProjectStore((state) => state.tasks);
  const updateTask = useProjectStore((state) => state.updateTask);
  const deleteTask = useProjectStore((state) => state.deleteTask);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<Status>('To Do');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getTasksByStatus = (status: Status) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find((t) => t.id === taskId);
    
    if (task && task.status !== status) {
      const updatedTask = {
        ...task,
        status,
        updatedAt: new Date().toISOString(),
      };
      updateTask(updatedTask);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Status) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      updateTask(updatedTask);
    }
  };

  const handleCreateTask = (status: Status) => {
    setCreateTaskStatus(status);
    setIsCreateModalOpen(true);
  };

  const getColumnIcon = (status: Status) => {
    switch (status) {
      case 'To Do':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'Done':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="h-full">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 h-[calc(100vh-16rem)] overflow-hidden">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div
              key={column.id}
              className="flex flex-col flex-1 min-w-[320px] bg-gray-50 rounded-lg"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`p-4 border-b border-gray-200 ${column.color} rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {getColumnIcon(column.id)}
                    <span className="ml-2">{column.name}</span>
                    <span className="ml-2 text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => handleCreateTask(column.id)}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white rounded"
                    title={`Add task to ${column.name}`}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      {getColumnIcon(column.id)}
                    </div>
                    <p className="text-sm text-gray-500">No tasks in {column.name}</p>
                    <button
                      onClick={() => handleCreateTask(column.id)}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Add a task
                    </button>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                    >
                      <TaskCard
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialStatus={createTaskStatus}
      />
    </div>
  );
}
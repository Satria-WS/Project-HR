// src/components/modals/CreateTaskModal.tsx
import React, { useState } from 'react';
import { X, Plus, Calendar, Flag, List } from 'lucide-react';
import { useProjectStore } from '@store/projectStore';
import { Priority, Status } from '@interface/common';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

export function CreateTaskModal({ isOpen, onClose, projectId }: CreateTaskModalProps) {
  const addTask = useProjectStore((state) => state.addTask);
  const projects = useProjectStore((state) => state.projects);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do' as Status,
    priority: 'Medium' as Priority,
    dueDate: '',
    projectId: projectId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask = {
      id: crypto.randomUUID(),
      ...formData,
      assigneeId: '', 
      labels: [],
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTask(newTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl transform transition-all">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            Create New Task
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Selection */}
          {!projectId && (
            <div className="mb-4">
              <label 
                htmlFor="projectId" 
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <List className="mr-2 text-indigo-500" />
                Project
              </label>
              <select
                id="projectId"
                required
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Task Title */}
          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Task Title
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Add task details"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="priority" 
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <Flag className="mr-2 text-indigo-500" />
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label 
                htmlFor="status" 
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <List className="mr-2 text-indigo-500" />
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label 
              htmlFor="dueDate" 
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
            >
              <Calendar className="mr-2 text-indigo-500" />
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
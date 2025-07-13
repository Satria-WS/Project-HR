import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  Flag,
  MessageSquare,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { Task, Priority, Status } from '../../types';
import { useProjectStore } from '../../store/projectStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Status) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const users = useProjectStore((state) => state.users);
  const comments = useProjectStore((state) => state.listComments(task.id));
  
  const assignee = users.find(u => u.id === task.assigneeId);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    return <Flag className={`h-3 w-3 ${
      priority === 'High' ? 'text-red-500' : 
      priority === 'Medium' ? 'text-yellow-500' : 
      'text-gray-400'
    }`} />;
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
  const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === 'Done') {
      setIsCompleting(true);
      // Simulate completion animation
      setTimeout(() => {
        onStatusChange(task.id, newStatus);
        setIsCompleting(false);
      }, 500);
    } else {
      onStatusChange(task.id, newStatus);
    }
  };

  const handleQuickComplete = () => {
    if (task.status !== 'Done') {
      handleStatusChange('Done');
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all duration-200 ${
      isCompleting ? 'animate-pulse bg-green-50' : ''
    } ${isOverdue ? 'border-l-4 border-l-red-400' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start space-x-2 flex-1">
          <button
            onClick={handleQuickComplete}
            className={`mt-1 flex-shrink-0 transition-colors ${
              task.status === 'Done' 
                ? 'text-green-500' 
                : 'text-gray-300 hover:text-green-500'
            }`}
          >
            <CheckCircle2 className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium text-gray-900 ${
              task.status === 'Done' ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-500 p-1"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-6 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.map((label, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-3">
          {/* Assignee */}
          <div className="flex items-center space-x-1">
            {assignee ? (
              <img
                src={assignee.avatar}
                alt={assignee.name}
                className="h-6 w-6 rounded-full"
                title={assignee.name}
              />
            ) : (
              <User className="h-6 w-6 rounded-full bg-gray-200 p-1 text-gray-400" />
            )}
          </div>

          {/* Comments */}
          {comments.length > 0 && (
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{comments.length}</span>
            </div>
          )}

          {/* Attachments */}
          {task.files && task.files.length > 0 && (
            <div className="flex items-center space-x-1 text-gray-500">
              <Paperclip className="h-4 w-4" />
              <span className="text-xs">{task.files.length}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Priority */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {getPriorityIcon(task.priority)}
            <span className="ml-1">{task.priority}</span>
          </span>

          {/* Due Date */}
          <div className={`flex items-center space-x-1 text-xs ${
            isOverdue ? 'text-red-600' : 
            daysUntilDue <= 1 ? 'text-orange-600' : 
            'text-gray-500'
          }`}>
            <Calendar className="h-3 w-3" />
            <span>
              {isOverdue ? 'Overdue' : 
               daysUntilDue === 0 ? 'Today' :
               daysUntilDue === 1 ? 'Tomorrow' :
               new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Status Change Buttons */}
      <div className="mt-3 flex space-x-1">
        {(['To Do', 'In Progress', 'Done'] as Status[]).map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              task.status === status
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
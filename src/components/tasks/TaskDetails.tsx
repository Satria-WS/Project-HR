import React, { useState } from 'react';
import { useProjectStore } from '@store/projectStore';
import { 
  MessageSquare, 
  Paperclip, 
  Send, 
  Clock,
  AlertCircle,
  User,
  Tag,
  Trash2
} from 'lucide-react';
import { Task, Comment } from '@/interface/common';

interface TaskDetailsProps {
  task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const addCommentToTask = useProjectStore((state) => state.addCommentToTask);
  const uploadFileToTask = useProjectStore((state) => state.uploadFileToTask);
  const listComments = useProjectStore((state) => state.listComments);
  const deleteComment = useProjectStore((state) => state.deleteComment);
  
  const comments = listComments(task.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    // Extract mentions from comment
    const mentions = comment.match(/@(\w+)/g)?.map(m => m.slice(1)) || [];

    addCommentToTask(task.id, {
      content: comment,
      userId: 'current-user', // TODO: Get from auth context
      mentions,
      attachments: []
    });

    setComment('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Implement actual file upload
    const fileData = {
      id: crypto.randomUUID(),
      taskId: task.id,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
      uploadedBy: 'current-user', // TODO: Get from auth context
      createdAt: new Date().toISOString()
    };

    uploadFileToTask(task.id, fileData);
    setSelectedFile(null);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          {/* Task Details */}
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">{task.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
            
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-1.5 h-4 w-4" />
                Due {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <User className="mr-1.5 h-4 w-4" />
                {task.assigneeId}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Tag className="mr-1.5 h-4 w-4" />
                {task.priority}
              </div>
            </div>
          </div>

          {/* Files */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">Attachments</h4>
            <div className="mt-2 space-y-2">
              {task.files.map((file) => (
                <div key={file.id} className="flex items-center justify-between">
                  <a
                    href={file.url}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    <Paperclip className="mr-1.5 h-4 w-4" />
                    {file.name}
                  </a>
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                <Paperclip className="mr-1.5 h-4 w-4" />
                Attach File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">Comments</h4>
            <div className="mt-2 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {comment.userId}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      {comment.content}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center space-x-2">
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <User className="h-6 w-6 rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Add a comment... Use @username to mention someone"
                    />
                    <div className="absolute bottom-2 right-2">
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
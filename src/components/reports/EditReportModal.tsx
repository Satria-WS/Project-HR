import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { ReportPreview } from './ReportPreview';

interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
}

export function EditReportModal({ isOpen, onClose, report }: EditReportModalProps) {
  const updateReport = useProjectStore((state) => state.updateReport);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    visibility: 'private' as 'public' | 'private' | 'team',
    tags: '',
  });

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title || '',
        type: report.type || '',
        description: report.description || '',
        visibility: report.settings?.visibility || 'private',
        tags: report.metadata?.tags?.join(', ') || '',
      });
    }
  }, [report]);

  if (!isOpen || !report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateReport(report.id, {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      metadata: {
        ...report.metadata,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      },
      settings: {
        ...report.settings,
        visibility: formData.visibility,
      },
    });
    
    onClose();
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className={`inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${
          showPreview ? 'sm:w-full sm:max-w-6xl' : 'sm:w-full sm:max-w-lg'
        }`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Edit Report
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={togglePreview}
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    showPreview 
                      ? 'text-indigo-700 bg-indigo-100 border-indigo-300' 
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Show Preview
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className={showPreview ? 'grid grid-cols-2 gap-6' : ''}>
              {/* Form Section */}
              <div className={showPreview ? 'space-y-6' : 'w-full'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Report Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Report Type
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="Custom">Custom</option>
                      <option value="Progress">Project Progress</option>
                      <option value="Performance">Team Performance</option>
                      <option value="Time">Time Tracking</option>
                      <option value="Completion">Completion Rate</option>
                      <option value="Excel Import">Excel Import</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                      Visibility
                    </label>
                    <select
                      id="visibility"
                      value={formData.visibility}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="private">Private</option>
                      <option value="team">Team</option>
                      <option value="public">Public</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="urgent, weekly, performance"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    >
                      Update Report
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview Section */}
              {showPreview && (
                <div className="border-l border-gray-200 pl-6">
                  <ReportPreview 
                    reportData={{
                      ...formData,
                      data: report.data
                    }}
                    showHeader={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
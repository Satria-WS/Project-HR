import React, { useState } from 'react';
import { X, Download, Share2, Edit, Eye, EyeOff, Maximize2 } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { ReportPreview } from './ReportPreview';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
}

export function ReportModal({ isOpen, onClose, report }: ReportModalProps) {
  const [viewMode, setViewMode] = useState<'detailed' | 'preview'>('detailed');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const renderChart = (chart: any) => {
    switch (chart.type) {
      case 'line':
        return <Line data={chart.data} options={chart.options} />;
      case 'bar':
        return <Bar data={chart.data} options={chart.options} />;
      case 'pie':
        return <Pie data={chart.data} options={chart.options} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'detailed' ? 'preview' : 'detailed');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className={`inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${
          isFullscreen ? 'sm:w-full sm:max-w-7xl sm:h-full' : 'sm:w-full sm:max-w-4xl'
        }`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {report.title}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleViewMode}
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    viewMode === 'preview' 
                      ? 'text-indigo-700 bg-indigo-100 border-indigo-300' 
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {viewMode === 'preview' ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Detailed View
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview Mode
                    </>
                  )}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="text-gray-400 hover:text-gray-500"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <Download className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className={`${isFullscreen ? 'h-full overflow-y-auto' : ''}`}>
              {viewMode === 'preview' ? (
                <ReportPreview 
                  reportData={{
                    title: report.title,
                    type: report.type,
                    description: report.description,
                    visibility: report.settings?.visibility,
                    tags: report.metadata?.tags?.join(', '),
                    data: report.data
                  }}
                  showHeader={false}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Description</h4>
                    <p className="mt-1 text-sm text-gray-600">{report.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Type</h4>
                      <p className="mt-1 text-sm text-gray-600">{report.type}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Created</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {report.metadata?.tags && report.metadata.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {report.metadata.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.data?.charts && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Charts</h4>
                      <div className="grid grid-cols-1 gap-6">
                        {report.data.charts.map((chart: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              {chart.title || `Chart ${index + 1}`}
                            </h5>
                            <div className={`${isFullscreen ? 'h-96' : 'h-64'}`}>
                              {renderChart(chart)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.data?.rawData && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Raw Data</h4>
                      <div className={`${isFullscreen ? 'max-h-96' : 'max-h-64'} overflow-auto bg-gray-50 p-4 rounded-lg`}>
                        <pre className="text-xs text-gray-600">
                          {JSON.stringify(report.data.rawData.slice(0, isFullscreen ? 20 : 5), null, 2)}
                          {report.data.rawData.length > (isFullscreen ? 20 : 5) && '\n... and more'}
                        </pre>
                      </div>
                    </div>
                  )}

                  {report.data?.fileName && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Import Information</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Source File:</strong> {report.data.fileName}</p>
                        <p><strong>Import Date:</strong> {new Date(report.data.importDate).toLocaleString()}</p>
                        <p><strong>Records:</strong> {report.data.rowCount} rows</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
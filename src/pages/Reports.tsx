import React, { useState, useCallback } from 'react';
import { 
  Download,
  Upload,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Share2,
  Eye,
  Copy,
  FileText
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { read, utils, writeFile } from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { ReportModal } from '../components/reports/ReportModal';
import { CreateReportModal } from '../components/reports/CreateReportModal';
import { EditReportModal } from '../components/reports/EditReportModal';
import { ShareReportModal } from '../components/reports/ShareReportModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const store = useProjectStore();
  
  const reports = store.listReports(
    selectedType ? { 
      type: selectedType,
      dateRange: dateRange.start && dateRange.end ? {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end)
      } : undefined
    } : undefined
  ).filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress((e.loaded / e.total) * 50);
        }
      };

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = read(data, { type: 'array' });
          
          setUploadProgress(75);
          
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = utils.sheet_to_json(worksheet);

          // Create a new report from Excel data
          const newReport = store.createReport({
            title: file.name.replace(/\.(xlsx|xls)$/, ''),
            type: 'Excel Import',
            description: `Imported from Excel file: ${file.name}`,
            data: {
              rawData: jsonData,
              fileName: file.name,
              importDate: new Date().toISOString(),
              rowCount: jsonData.length
            },
            metadata: {
              author: 'Current User',
              department: 'Engineering',
              tags: ['imported', 'excel'],
            },
            settings: {
              visibility: 'private',
            },
          });

          // Generate charts from the data if possible
          if (jsonData.length > 0) {
            const firstRow = jsonData[0] as any;
            const keys = Object.keys(firstRow);
            
            // Try to find date and numeric columns
            const dateColumn = keys.find(key => 
              key.toLowerCase().includes('date') || 
              key.toLowerCase().includes('time')
            );
            const numericColumns = keys.filter(key => {
              const value = firstRow[key];
              return !isNaN(Number(value)) && value !== '';
            });

            if (dateColumn && numericColumns.length > 0) {
              const chartData = {
                labels: jsonData.map((row: any) => row[dateColumn] || 'N/A'),
                datasets: numericColumns.slice(0, 3).map((column, index) => ({
                  label: column,
                  data: jsonData.map((row: any) => Number(row[column]) || 0),
                  borderColor: `hsl(${index * 120}, 70%, 50%)`,
                  backgroundColor: `hsla(${index * 120}, 70%, 50%, 0.1)`,
                  tension: 0.1,
                })),
              };

              store.updateReport(newReport.id, {
                ...newReport,
                data: {
                  ...newReport.data,
                  charts: [
                    {
                      type: 'line',
                      title: 'Data Trends',
                      data: chartData,
                      options: {
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' as const },
                          title: {
                            display: true,
                            text: `Data from ${file.name}`,
                          },
                        },
                      },
                    },
                  ],
                },
              });
            }
          }

          setUploadProgress(100);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 1000);

        } catch (error) {
          console.error('Error processing Excel file:', error);
          alert('Error processing Excel file. Please check the format.');
          setIsUploading(false);
          setUploadProgress(0);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }

    // Reset file input
    event.target.value = '';
  }, [store]);

  const handleDownloadReport = (report: any, format: 'excel' | 'pdf' = 'excel') => {
    if (format === 'excel') {
      // Create Excel file from report data
      const ws = utils.json_to_sheet(report.data?.rawData || [{ 
        Title: report.title,
        Type: report.type,
        Created: report.createdAt,
        Description: report.description 
      }]);
      
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Report Data');
      
      writeFile(wb, `${report.title}.xlsx`);
    } else {
      // For PDF, we'll simulate the download
      const content = `
Report: ${report.title}
Type: ${report.type}
Created: ${new Date(report.createdAt).toLocaleDateString()}
Description: ${report.description}

Data: ${JSON.stringify(report.data, null, 2)}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDuplicateReport = (report: any) => {
    const duplicatedReport = store.createReport({
      title: `${report.title} (Copy)`,
      type: report.type,
      description: `Copy of: ${report.description}`,
      data: { ...report.data },
      metadata: {
        ...report.metadata,
        tags: [...report.metadata.tags, 'duplicate'],
      },
      settings: report.settings,
    });
    
    alert(`Report duplicated successfully! New report ID: ${duplicatedReport.id}`);
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const handleEditReport = (report: any) => {
    setSelectedReport(report);
    setIsEditModalOpen(true);
  };

  const handleShareReport = (report: any) => {
    setSelectedReport(report);
    setIsShareModalOpen(true);
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      store.deleteReport(reportId);
      alert('Report deleted successfully!');
    }
  };

  const generateSampleReport = (type: string) => {
    const sampleData = {
      'progress': {
        title: 'Project Progress Report',
        description: 'Overview of all project statuses and milestones',
        data: {
          projects: [
            { name: 'Website Redesign', progress: 75, status: 'On Track' },
            { name: 'Mobile App', progress: 45, status: 'Behind' },
            { name: 'API Integration', progress: 90, status: 'Ahead' },
          ],
          totalProjects: 3,
          averageProgress: 70,
        },
      },
      'performance': {
        title: 'Team Performance Report',
        description: 'Analysis of team productivity and task completion rates',
        data: {
          teamMembers: [
            { name: 'John Doe', tasksCompleted: 15, efficiency: 92 },
            { name: 'Jane Smith', tasksCompleted: 12, efficiency: 88 },
            { name: 'Bob Johnson', tasksCompleted: 18, efficiency: 95 },
          ],
          averageEfficiency: 91.7,
          totalTasksCompleted: 45,
        },
      },
      'time': {
        title: 'Time Tracking Report',
        description: 'Summary of hours spent on different projects and tasks',
        data: {
          dailyHours: [8, 7.5, 9, 8.5, 7, 0, 0],
          weeklyTotal: 40,
          projectBreakdown: [
            { project: 'Website Redesign', hours: 20 },
            { project: 'Mobile App', hours: 15 },
            { project: 'API Integration', hours: 5 },
          ],
        },
      },
      'completion': {
        title: 'Completion Rate Report',
        description: 'Analysis of task completion rates and project delivery',
        data: {
          completionRates: [85, 92, 78, 88, 95],
          averageCompletionRate: 87.6,
          onTimeDelivery: 82,
          qualityScore: 4.2,
        },
      },
    };

    const reportData = sampleData[type as keyof typeof sampleData];
    if (reportData) {
      store.createReport({
        ...reportData,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        metadata: {
          author: 'System',
          department: 'Engineering',
          tags: ['sample', 'generated'],
        },
        settings: {
          visibility: 'public',
        },
      });
      alert('Sample report generated successfully!');
    }
  };

  const reportTypes = [
    {
      id: 'progress',
      name: 'Project Progress',
      icon: TrendingUp,
      description: 'Overview of all project statuses and milestones',
    },
    {
      id: 'performance',
      name: 'Team Performance',
      icon: Users,
      description: 'Analysis of team productivity and task completion rates',
    },
    {
      id: 'time',
      name: 'Time Tracking',
      icon: Clock,
      description: 'Summary of hours spent on different projects and tasks',
    },
    {
      id: 'completion',
      name: 'Completion Rate',
      icon: CheckCircle2,
      description: 'Analysis of task completion rates and project delivery',
    },
  ];

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Reports
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Types</option>
            {reportTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="relative">
            <label className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
              <Upload className="h-5 w-5 mr-2" />
              {isUploading ? `${uploadProgress.toFixed(0)}%` : 'Import Excel'}
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {isUploading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md p-2 shadow-lg">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
            Create Report
          </button>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500 truncate">{report.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button 
                  onClick={() => generateSampleReport(report.id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Generate Sample
                </button>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDownloadReport({ title: report.name, type: report.id, data: {} }, 'excel')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reports List */}
      <div className="mt-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Created
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Author
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-gray-500 text-xs">{report.description}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {report.createdBy}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Report"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditReport(report)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit Report"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateReport(report)}
                        className="text-green-600 hover:text-green-900"
                        title="Duplicate Report"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadReport(report)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Download Report"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShareReport(report)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Share Report"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No reports found. Create your first report or import from Excel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Time Tracking Overview</h3>
          <Line
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  label: 'Hours Worked',
                  data: [8, 7.5, 9, 8.5, 7, 4, 0],
                  borderColor: 'rgb(75, 192, 192)',
                  backgroundColor: 'rgba(75, 192, 192, 0.1)',
                  tension: 0.1,
                },
                {
                  label: 'Target Hours',
                  data: [8, 8, 8, 8, 8, 0, 0],
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.1)',
                  borderDash: [5, 5],
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const },
                title: {
                  display: true,
                  text: 'Weekly Time Tracking',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 10,
                },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Completion Rate</h3>
          <Bar
            data={{
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              datasets: [
                {
                  label: 'Completed Tasks',
                  data: [12, 19, 15, 17],
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgb(54, 162, 235)',
                  borderWidth: 1,
                },
                {
                  label: 'Planned Tasks',
                  data: [15, 20, 18, 20],
                  backgroundColor: 'rgba(255, 206, 86, 0.5)',
                  borderColor: 'rgb(255, 206, 86)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const },
                title: {
                  display: true,
                  text: 'Monthly Task Completion',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Distribution</h3>
          <Pie
            data={{
              labels: ['Website Redesign', 'Mobile App', 'API Integration', 'Documentation'],
              datasets: [
                {
                  data: [30, 25, 20, 25],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'right' as const },
                title: {
                  display: true,
                  text: 'Time Distribution by Project',
                },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Performance</h3>
          <Bar
            data={{
              labels: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'],
              datasets: [
                {
                  label: 'Efficiency %',
                  data: [92, 88, 95, 85],
                  backgroundColor: 'rgba(153, 102, 255, 0.5)',
                  borderColor: 'rgb(153, 102, 255)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const },
                title: {
                  display: true,
                  text: 'Team Member Efficiency',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      {selectedReport && (
        <>
          <ReportModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            report={selectedReport}
          />
          
          <EditReportModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            report={selectedReport}
          />
          
          <ShareReportModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            report={selectedReport}
          />
        </>
      )}
    </div>
  );
}
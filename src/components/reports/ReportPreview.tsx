import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FileText, Calendar, User, Tag, Eye } from 'lucide-react';

interface ReportPreviewProps {
  reportData: {
    title: string;
    type: string;
    description: string;
    visibility?: string;
    tags?: string;
    data?: any;
  };
  showHeader?: boolean;
}

export function ReportPreview({ reportData, showHeader = true }: ReportPreviewProps) {
  const generateSampleChart = (type: string) => {
    const sampleData = {
      'Progress': {
        type: 'bar',
        data: {
          labels: ['Website Redesign', 'Mobile App', 'API Integration', 'Documentation'],
          datasets: [{
            label: 'Progress %',
            data: [75, 45, 90, 60],
            backgroundColor: [
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(255, 99, 132, 0.8)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Project Progress Overview' },
          },
          scales: { y: { beginAtZero: true, max: 100 } },
        },
      },
      'Performance': {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Team Efficiency %',
            data: [85, 92, 78, 88],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Team Performance Trends' },
          },
          scales: { y: { beginAtZero: true, max: 100 } },
        },
      },
      'Time': {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Hours Worked',
              data: [8, 7.5, 9, 8.5, 7, 4, 0],
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.1,
            },
            {
              label: 'Target Hours',
              data: [8, 8, 8, 8, 8, 0, 0],
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderDash: [5, 5],
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Weekly Time Tracking' },
          },
          scales: { y: { beginAtZero: true, max: 10 } },
        },
      },
      'Completion': {
        type: 'pie',
        data: {
          labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
          datasets: [{
            data: [65, 20, 10, 5],
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 99, 132, 0.8)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right' as const },
            title: { display: true, text: 'Task Completion Distribution' },
          },
        },
      },
      'Custom': {
        type: 'bar',
        data: {
          labels: ['Category A', 'Category B', 'Category C', 'Category D'],
          datasets: [{
            label: 'Sample Data',
            data: [12, 19, 15, 17],
            backgroundColor: 'rgba(153, 102, 255, 0.8)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Custom Report Data' },
          },
          scales: { y: { beginAtZero: true } },
        },
      },
    };

    return sampleData[type as keyof typeof sampleData] || sampleData.Custom;
  };

  const renderChart = (chartConfig: any) => {
    switch (chartConfig.type) {
      case 'line':
        return <Line data={chartConfig.data} options={chartConfig.options} />;
      case 'bar':
        return <Bar data={chartConfig.data} options={chartConfig.options} />;
      case 'pie':
        return <Pie data={chartConfig.data} options={chartConfig.options} />;
      default:
        return <div className="text-center text-gray-500">Unsupported chart type</div>;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'bg-green-100 text-green-800';
      case 'team':
        return 'bg-blue-100 text-blue-800';
      case 'private':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const chartConfig = reportData.data?.charts?.[0] || generateSampleChart(reportData.type);
  const tags = reportData.tags ? reportData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Report Preview</h3>
          </div>
        </div>
      )}
      
      <div className="p-6 space-y-6">
        {/* Report Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {reportData.title || 'Untitled Report'}
            </h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>{reportData.type || 'Custom'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>Current User</span>
              </div>
              {reportData.visibility && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVisibilityColor(reportData.visibility)}`}>
                  {reportData.visibility.charAt(0).toUpperCase() + reportData.visibility.slice(1)}
                </span>
              )}
            </div>
          </div>

          {reportData.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">{reportData.description}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
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
        </div>

        {/* Chart Section */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Data Visualization</h4>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="h-80">
              {renderChart(chartConfig)}
            </div>
          </div>
        </div>

        {/* Sample Data Table */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Sample Data</h4>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Total Projects
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    12
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Completion Rate
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    87.5%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      On Track
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Team Efficiency
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    91.2%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Excellent
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Report Summary</h4>
          <p className="text-sm text-blue-700">
            This {reportData.type.toLowerCase()} report provides insights into project performance and team productivity. 
            The data shows positive trends with room for improvement in specific areas. 
            {reportData.description && ` ${reportData.description}`}
          </p>
        </div>
      </div>
    </div>
  );
}
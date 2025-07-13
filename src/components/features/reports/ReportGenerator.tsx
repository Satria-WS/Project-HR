import React, { useState } from 'react';
import { useProjectStore } from '@store/projectStore';
import { 
  FileText,
  Download,
  Calendar,
  User,
  BarChart2
} from 'lucide-react';
import { ReportPeriod, ReportFormat } from '@/interface/common';

export function ReportGenerator() {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('Weekly');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('PDF');
  
  const generateWeeklySummary = useProjectStore((state) => state.generateWeeklySummary);
  const generatePerformanceReport = useProjectStore((state) => state.generatePerformanceReport);
  const downloadReport = useProjectStore((state) => state.downloadReport);
  const createCustomReport = useProjectStore((state) => state.createCustomReport);

  const handleGenerateReport = () => {
    const report = createCustomReport({
      title: `${selectedPeriod} Report`,
      description: `Generated ${selectedPeriod.toLowerCase()} report`,
      type: 'Custom',
      period: selectedPeriod,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      format: selectedFormat
    });

    downloadReport(report.id, selectedFormat);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Generate Report
        </h3>
        
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as ReportPeriod)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as ReportFormat)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="PDF">PDF</option>
              <option value="Excel">Excel</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerateReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
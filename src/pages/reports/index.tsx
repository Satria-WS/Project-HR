// src/pages/reports/index.tsx
import React from 'react';
import { ReportGenerator } from '@/components/features/reports/ReportGenerator';
import { FileText } from 'lucide-react';

export function Reports() {
  return (
    <div className="p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-500">
            Generate and manage project reports
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ReportGenerator />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate your first report to see it here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

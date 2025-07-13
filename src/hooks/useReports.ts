import { useProjectStore } from '../store/projectStore';
import { Report, ReportPeriod, ReportFormat } from '@interface/common';

export const useReports = () => {
  const store = useProjectStore();

  const createReport = (reportData: {
    title: string;
    type: string;
    description: string;
    period?: ReportPeriod;
    format?: ReportFormat;
  }) => {
    const newReport = store.createReport({
      ...reportData,
      data: {},
      metadata: {
        author: 'Current User',
        department: 'Engineering',
        tags: [],
      },
      settings: {
        visibility: 'private',
      },
    });
    return newReport;
  };

  const downloadReport = (reportId: string, format: ReportFormat = 'excel') => {
    store.downloadReport(reportId, format);
  };

  const listReports = (filters?: { 
    type?: string; 
    dateRange?: { start: Date; end: Date } 
  }) => {
    return store.listReports(filters);
  };

  return {
    createReport,
    downloadReport,
    listReports,
  };
};
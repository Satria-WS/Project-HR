export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'To Do' | 'In Progress' | 'Done';
export type Label = string;
export type Role = 'Admin' | 'Manager' | 'Staff';
export type ReportFormat = 'PDF' | 'Excel';
export type ReportPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
export type NotificationType = 'Task' | 'Project' | 'Deadline' | 'Mention' | 'System';
export type CustomOptionType = 'status' | 'label' | 'report';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  projectId: string;
  labels: Label[];
  dueDate: string;
  files: TaskFile[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFile {
  id: string;
  taskId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  teamIds: string[];
  customStatuses: CustomStatus[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  mentions: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  data: {
    taskId?: string;
    projectId?: string;
    commentId?: string;
  };
  createdAt: string;
}

export interface CustomStatus {
  id: string;
  name: string;
  color: string;
  projectId: string;
  order: number;
  createdAt: string;
}

export interface CustomLabel {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface ReportCategory {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  createdAt: string;
}

export interface Attendance {
  id: string;
  userId: string;
  projectId: string;
  checkIn: string;
  checkOut: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  type: string;
  title: string;
  description: string;
  data: any;
  format: ReportFormat;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    author: string;
    department: string;
    tags: string[];
  };
  settings?: {
    visibility: 'public' | 'private' | 'team';
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      nextRun: Date;
    };
  };
}

export interface DailyReport {
  date: string;
  totalTasks: number;
  completedTasks: number;
  activeUsers: number;
  tasksByStatus: Record<Status, number>;
  tasksByPriority: Record<Priority, number>;
  attendance: {
    present: number;
    absent: number;
    totalHours: number;
  };
}

export interface WeeklySummary {
  projectId: string;
  startDate: string;
  endDate: string;
  progress: number;
  milestones: {
    total: number;
    completed: number;
  };
  taskMetrics: {
    created: number;
    completed: number;
    overdue: number;
  };
  teamPerformance: {
    userId: string;
    tasksCompleted: number;
    hoursWorked: number;
  }[];
}

export interface PerformanceReport {
  userId: string;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  metrics: {
    tasksCompleted: number;
    tasksInProgress: number;
    avgCompletionTime: number;
    onTimeDelivery: number;
  };
  attendance: {
    daysPresent: number;
    totalHours: number;
    avgHoursPerDay: number;
  };
  projectContributions: {
    projectId: string;
    tasksCompleted: number;
    hoursContributed: number;
  }[];
}
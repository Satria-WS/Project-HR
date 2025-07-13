import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Project, 
  Task, 
  User, 
  Comment, 
  Status, 
  Label, 
  Role, 
  Attendance,
  Report,
  DailyReport,
  WeeklySummary,
  PerformanceReport,
  ReportFormat,
  ReportPeriod,
  Notification,
  CustomStatus,
  CustomLabel,
  ReportCategory,
  TaskFile
} from '../interface/common';

interface ReportData {
  title: string;
  type: string;
  description: string;
  data: any;
  metadata: {
    author: string;
    department: string;
    tags: string[];
  };
  settings: {
    visibility: 'public' | 'private' | 'team';
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      nextRun: Date;
    };
  };
}

interface FilterOptions {
  type?: string;
  department?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  author?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
}

interface ProjectState {
  projects: Project[];
  tasks: Task[];
  users: User[];
  comments: Comment[];
  attendance: Attendance[];
  reports: Report[];
  notifications: Notification[];
  customStatuses: CustomStatus[];
  customLabels: CustomLabel[];
  reportCategories: ReportCategory[];
  selectedProjectId: string | null;
  selectedTaskId: string | null;
  
  // Project actions
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  setSelectedProject: (projectId: string | null) => void;
  getProjectById: (projectId: string) => Project | undefined;
  listProjects: (filterOptions?: { status?: string; teamId?: string }) => Project[];
  assignUserToProject: (projectId: string, userId: string) => void;
  
  // Task actions
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  setSelectedTask: (taskId: string | null) => void;
  getTaskById: (taskId: string) => Task | undefined;
  listTasksByProject: (projectId: string) => Task[];
  changeTaskStatus: (taskId: string, newStatus: Status) => void;
  addLabelToTask: (taskId: string, label: Label) => void;
  setTaskDeadline: (taskId: string, deadlineDate: string) => void;
  uploadFileToTask: (taskId: string, file: TaskFile) => void;
  listOverdueTasks: (projectId: string) => Task[];
  getUpcomingDeadlines: (projectId: string) => Task[];
  
  // User actions
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (userId: string, updatedData: Partial<User>) => void;
  assignRole: (userId: string, role: Role) => void;
  getUserById: (userId: string) => User | undefined;
  listUsersByRole: (role: Role) => User[];
  
  // Comment actions
  addCommentToTask: (taskId: string, commentData: Omit<Comment, 'id' | 'taskId' | 'createdAt' | 'updatedAt'>) => void;
  listComments: (taskId: string) => Comment[];
  deleteComment: (commentId: string) => void;

  // Notification actions
  sendNotificationToUser: (userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  sendProjectDeadlineReminder: (projectId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  markNotificationAsRead: (notificationId: string) => void;

  // Custom options actions
  createCustomStatus: (projectId: string, statusName: string, color: string) => void;
  addTaskLabel: (labelName: string, color: string) => void;
  createReportCategory: (name: string, description: string, metrics: string[]) => void;
  listCustomOptions: (type: 'status' | 'label' | 'report') => (CustomStatus | CustomLabel | ReportCategory)[];

  // Progress tracking
  getProjectProgress: (projectId: string) => number;
  getUserPerformance: (userId: string, period: ReportPeriod) => PerformanceReport;

  // Attendance actions
  recordCheckIn: (userId: string, projectId: string, timestamp: string) => void;
  recordCheckOut: (userId: string, timestamp: string) => void;
  getAttendanceByDate: (userId: string, date: string) => Attendance[];
  listAttendanceForUser: (userId: string) => Attendance[];
  listAttendanceForProject: (projectId: string) => Attendance[];

  // Report actions
  submitDailyReport: (reportData: DailyReport) => Report;
  generateWeeklySummary: (projectId: string) => WeeklySummary;
  generatePerformanceReport: (userId: string, period: ReportPeriod) => PerformanceReport;
  createCustomReport: (options: {
    title: string;
    description: string;
    type: string;
    period: ReportPeriod;
    startDate: string;
    endDate: string;
    format: ReportFormat;
  }) => Report;
  downloadReport: (reportId: string, format: ReportFormat) => void;
  createReport: (data: ReportData) => Report;
  getReportById: (reportId: string) => Report | undefined;
  updateReport: (reportId: string, data: Partial<Report>) => Report;
  deleteReport: (reportId: string) => void;
  listReports: (filterOptions?: FilterOptions) => Report[];
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [
        {
          id: '1',
          name: 'Website Redesign',
          description: 'Complete overhaul of company website with modern design',
          status: 'Active',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          teamIds: ['user-1', 'user-2'],
          customStatuses: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Mobile App Development',
          description: 'Native mobile app for iOS and Android platforms',
          status: 'Planning',
          startDate: '2024-02-01',
          endDate: '2024-06-30',
          teamIds: ['user-2', 'user-3'],
          customStatuses: [],
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z',
        },
      ],
      tasks: [
        {
          id: 'task-1',
          title: 'Design Homepage Layout',
          description: 'Create wireframes and mockups for the new homepage design',
          status: 'In Progress',
          priority: 'High',
          assigneeId: 'user-1',
          projectId: '1',
          labels: ['design', 'frontend'],
          dueDate: '2024-01-15',
          files: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-2',
          title: 'Set up Development Environment',
          description: 'Configure development tools and dependencies',
          status: 'Done',
          priority: 'Medium',
          assigneeId: 'user-2',
          projectId: '1',
          labels: ['setup', 'development'],
          dueDate: '2024-01-10',
          files: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-3',
          title: 'Research Mobile Frameworks',
          description: 'Evaluate React Native vs Flutter for mobile development',
          status: 'To Do',
          priority: 'Medium',
          assigneeId: 'user-3',
          projectId: '2',
          labels: ['research', 'mobile'],
          dueDate: '2024-02-15',
          files: [],
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z',
        },
      ],
      users: [
        {
          id: 'user-1',
          name: 'Sarah Chen',
          email: 'sarah.chen@example.com',
          role: 'Manager',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'user-2',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          role: 'Staff',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'user-3',
          name: 'Alex Kim',
          email: 'alex.kim@example.com',
          role: 'Staff',
          avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
      comments: [],
      attendance: [],
      reports: [],
      notifications: [],
      customStatuses: [],
      customLabels: [],
      reportCategories: [],
      selectedProjectId: null,
      selectedTaskId: null,

      // Project actions
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      
      updateProject: (project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === project.id ? project : p
          ),
        })),
      
      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          tasks: state.tasks.filter((t) => t.projectId !== projectId),
        })),
      
      setSelectedProject: (projectId) =>
        set({ selectedProjectId: projectId }),

      getProjectById: (projectId) => {
        const state = get();
        return state.projects.find((p) => p.id === projectId);
      },

      listProjects: (filterOptions) => {
        const state = get();
        let filteredProjects = state.projects;

        if (filterOptions?.status) {
          filteredProjects = filteredProjects.filter(p => p.status === filterOptions.status);
        }

        if (filterOptions?.teamId) {
          filteredProjects = filteredProjects.filter(p => p.teamIds.includes(filterOptions.teamId));
        }

        return filteredProjects;
      },

      assignUserToProject: (projectId, userId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, teamIds: [...p.teamIds, userId] }
              : p
          ),
        })),

      // Task actions
      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
      
      updateTask: (task) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === task.id ? task : t
          ),
        })),
      
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
          comments: state.comments.filter((c) => c.taskId !== taskId),
        })),
      
      setSelectedTask: (taskId) =>
        set({ selectedTaskId: taskId }),

      getTaskById: (taskId) => {
        const state = get();
        return state.tasks.find((t) => t.id === taskId);
      },

      listTasksByProject: (projectId) => {
        const state = get();
        return state.tasks.filter((t) => t.projectId === projectId);
      },

      changeTaskStatus: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      addLabelToTask: (taskId, label) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, labels: [...t.labels, label], updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      setTaskDeadline: (taskId, deadlineDate) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, dueDate: deadlineDate, updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      uploadFileToTask: (taskId, file) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, files: [...t.files, file], updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      listOverdueTasks: (projectId) => {
        const state = get();
        const now = new Date();
        return state.tasks.filter((t) => 
          t.projectId === projectId &&
          t.status !== 'Done' &&
          new Date(t.dueDate) < now
        );
      },

      getUpcomingDeadlines: (projectId) => {
        const state = get();
        const now = new Date();
        const weekFromNow = new Date();
        weekFromNow.setDate(now.getDate() + 7);

        return state.tasks.filter((t) =>
          t.projectId === projectId &&
          t.status !== 'Done' &&
          new Date(t.dueDate) >= now &&
          new Date(t.dueDate) <= weekFromNow
        );
      },

      // User actions
      createUser: (userData) => {
        const newUser: User = {
          id: crypto.randomUUID(),
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },

      updateUser: (userId, updatedData) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? { ...u, ...updatedData, updatedAt: new Date().toISOString() }
              : u
          ),
        })),

      assignRole: (userId, role) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? { ...u, role, updatedAt: new Date().toISOString() }
              : u
          ),
        })),

      getUserById: (userId) => {
        const state = get();
        return state.users.find((u) => u.id === userId);
      },

      listUsersByRole: (role) => {
        const state = get();
        return state.users.filter((u) => u.role === role);
      },

      // Comment actions
      addCommentToTask: (taskId, commentData) => {
        const newComment: Comment = {
          id: crypto.randomUUID(),
          taskId,
          ...commentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ comments: [...state.comments, newComment] }));

        // Send notifications for mentions
        const state = get();
        commentData.mentions.forEach((userId) => {
          state.sendNotificationToUser(userId, {
            type: 'Mention',
            title: 'You were mentioned in a comment',
            message: `You were mentioned in a comment on task ${taskId}`,
            userId,
            data: { taskId, commentId: newComment.id },
          });
        });
      },

      listComments: (taskId) => {
        const state = get();
        return state.comments.filter((c) => c.taskId === taskId);
      },

      deleteComment: (commentId) =>
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
        })),

      // Notification actions
      sendNotificationToUser: (userId, notification) => {
        const newNotification: Notification = {
          id: crypto.randomUUID(),
          ...notification,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
      },

      sendProjectDeadlineReminder: (projectId) => {
        const state = get();
        const project = state.projects.find(p => p.id === projectId);
        if (!project) return;

        project.teamIds.forEach((userId) => {
          state.sendNotificationToUser(userId, {
            type: 'Deadline',
            title: 'Project Deadline Reminder',
            message: `Project "${project.name}" is due on ${project.endDate}`,
            userId,
            data: { projectId },
          });
        });
      },

      getUserNotifications: (userId) => {
        const state = get();
        return state.notifications.filter((n) => n.userId === userId);
      },

      markNotificationAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),

      // Custom options actions
      createCustomStatus: (projectId, statusName, color) => {
        const newStatus: CustomStatus = {
          id: crypto.randomUUID(),
          name: statusName,
          color,
          projectId,
          order: get().customStatuses.length,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          customStatuses: [...state.customStatuses, newStatus],
        }));
      },

      addTaskLabel: (labelName, color) => {
        const newLabel: CustomLabel = {
          id: crypto.randomUUID(),
          name: labelName,
          color,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          customLabels: [...state.customLabels, newLabel],
        }));
      },

      createReportCategory: (name, description, metrics) => {
        const newCategory: ReportCategory = {
          id: crypto.randomUUID(),
          name,
          description,
          metrics,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          reportCategories: [...state.reportCategories, newCategory],
        }));
      },

      listCustomOptions: (type) => {
        const state = get();
        switch (type) {
          case 'status':
            return state.customStatuses;
          case 'label':
            return state.customLabels;
          case 'report':
            return state.reportCategories;
          default:
            return [];
        }
      },

      // Progress tracking
      getProjectProgress: (projectId) => {
        const state = get();
        const tasks = state.tasks.filter(t => t.projectId === projectId);
        if (tasks.length === 0) return 0;

        const completedTasks = tasks.filter(t => t.status === 'Done');
        return (completedTasks.length / tasks.length) * 100;
      },

      getUserPerformance: (userId, period) => {
        return get().generatePerformanceReport(userId, period);
      },

      // Attendance actions
      recordCheckIn: (userId, projectId, timestamp) => {
        const newAttendance: Attendance = {
          id: crypto.randomUUID(),
          userId,
          projectId,
          checkIn: timestamp,
          checkOut: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ attendance: [...state.attendance, newAttendance] }));
      },

      recordCheckOut: (userId, timestamp) =>
        set((state) => ({
          attendance: state.attendance.map((a) =>
            a.userId === userId && !a.checkOut
              ? { ...a, checkOut: timestamp, updatedAt: new Date().toISOString() }
              : a
          ),
        })),

      getAttendanceByDate: (userId, date) => {
        const state = get();
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return state.attendance.filter(
          (a) => a.userId === userId &&
          new Date(a.checkIn) >= startOfDay &&
          new Date(a.checkIn) <= endOfDay
        );
      },

      listAttendanceForUser: (userId) => {
        const state = get();
        return state.attendance.filter((a) => a.userId === userId);
      },

      listAttendanceForProject: (projectId) => {
        const state = get();
        return state.attendance.filter((a) => a.projectId === projectId);
      },

      // Report actions
      submitDailyReport: (reportData) => {
        const newReport: Report = {
          id: crypto.randomUUID(),
          type: 'Daily',
          title: `Daily Report - ${reportData.date}`,
          description: 'Daily project and team performance summary',
          data: reportData,
          format: 'PDF',
          period: 'Daily',
          startDate: reportData.date,
          endDate: reportData.date,
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ reports: [...state.reports, newReport] }));
        return newReport;
      },

      generateWeeklySummary: (projectId) => {
        const state = get();
        const project = state.projects.find(p => p.id === projectId);
        if (!project) throw new Error('Project not found');

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);

        const projectTasks = state.tasks.filter(t => t.projectId === projectId);
        const completedTasks = projectTasks.filter(t => t.status === 'Done');

        const summary: WeeklySummary = {
          projectId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          progress: (completedTasks.length / projectTasks.length) * 100,
          milestones: {
            total: 10,
            completed: 7,
          },
          taskMetrics: {
            created: projectTasks.filter(t => 
              new Date(t.createdAt) >= startDate && 
              new Date(t.createdAt) <= endDate
            ).length,
            completed: completedTasks.filter(t =>
              new Date(t.updatedAt) >= startDate &&
              new Date(t.updatedAt) <= endDate
            ).length,
            overdue: projectTasks.filter(t =>
              new Date(t.dueDate) < new Date() &&
              t.status !== 'Done'
            ).length,
          },
          teamPerformance: project.teamIds.map(userId => ({
            userId,
            tasksCompleted: completedTasks.filter(t => t.assigneeId === userId).length,
            hoursWorked: state.attendance
              .filter(a => 
                a.userId === userId &&
                a.projectId === projectId &&
                new Date(a.checkIn) >= startDate &&
                new Date(a.checkIn) <= endDate &&
                a.checkOut
              )
              .reduce((total, a) => {
                const hours = (new Date(a.checkOut!).getTime() - new Date(a.checkIn).getTime()) / (1000 * 60 * 60);
                return total + hours;
              }, 0),
          })),
        };

        return summary;
      },

      generatePerformanceReport: (userId, period) => {
        const state = get();
        const user = state.users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');

        const endDate = new Date();
        const startDate = new Date();
        
        switch (period) {
          case 'Weekly':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case 'Monthly':
            startDate.setMonth(endDate.getMonth() - 1);
            break;
          default:
            startDate.setDate(endDate.getDate() - 1);
        }

        const userTasks = state.tasks.filter(t => t.assigneeId === userId);
        const completedTasks = userTasks.filter(t => t.status === 'Done');
        const attendance = state.attendance.filter(a => 
          a.userId === userId &&
          new Date(a.checkIn) >= startDate &&
          new Date(a.checkIn) <= endDate &&
          a.checkOut
        );

        const report: PerformanceReport = {
          userId,
          period,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          metrics: {
            tasksCompleted: completedTasks.length,
            tasksInProgress: userTasks.filter(t => t.status === 'In Progress').length,
            avgCompletionTime: completedTasks.reduce((total, task) => {
              const completionTime = new Date(task.updatedAt).getTime() - new Date(task.createdAt).getTime();
              return total + (completionTime / (1000 * 60 * 60));
            }, 0) / completedTasks.length,
            onTimeDelivery: completedTasks.filter(t => 
              new Date(t.updatedAt) <= new Date(t.dueDate)
            ).length / completedTasks.length * 100,
          },
          attendance: {
            daysPresent: attendance.length,
            totalHours: attendance.reduce((total, a) => {
              const hours = (new Date(a.checkOut!).getTime() - new Date(a.checkIn).getTime()) / (1000 * 60 * 60);
              return total + hours;
            }, 0),
            avgHoursPerDay: attendance.reduce((total, a) => {
              const hours = (new Date(a.checkOut!).getTime() - new Date(a.checkIn).getTime()) / (1000 * 60 * 60);
              return total + hours;
            }, 0) / attendance.length,
          },
          projectContributions: state.projects
            .filter(p => p.teamIds.includes(userId))
            .map(project => ({
              projectId: project.id,
              tasksCompleted: completedTasks.filter(t => t.projectId === project.id).length,
              hoursContributed: attendance
                .filter(a => a.projectId === project.id)
                .reduce((total, a) => {
                  const hours = (new Date(a.checkOut!).getTime() - new Date(a.checkIn).getTime()) / (1000 * 60 * 60);
                  return total + hours;
                }, 0),
            })),
        };

        return report;
      },

      createCustomReport: (options) => {
        const newReport: Report = {
          id: crypto.randomUUID(),
          ...options,
          data: null,
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ reports: [...state.reports, newReport] }));
        return newReport;
      },

      downloadReport: (reportId, format) => {
        const state = get();
        const report = state.reports.find(r => r.id === reportId);
        if (!report) throw new Error('Report not found');
        
        console.log(`Downloading report ${reportId} in ${format} format`);
      },

      createReport: (data) => {
        const newReport: Report = {
          id: crypto.randomUUID(),
          title: data.title,
          type: data.type,
          description: data.description,
          data: data.data,
          format: 'PDF',
          period: 'Custom',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          createdBy: data.metadata.author,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: data.metadata,
          settings: data.settings,
        };
        set((state) => ({ reports: [...state.reports, newReport] }));
        return newReport;
      },

      getReportById: (reportId) => {
        const state = get();
        return state.reports.find((r) => r.id === reportId);
      },

      updateReport: (reportId, data) => {
        let updatedReport: Report | undefined;
        set((state) => ({
          reports: state.reports.map((r) => {
            if (r.id === reportId) {
              updatedReport = {
                ...r,
                ...data,
                updatedAt: new Date().toISOString(),
              };
              return updatedReport;
            }
            return r;
          }),
        }));
        if (!updatedReport) {
          throw new Error('Report not found');
        }
        return updatedReport;
      },

      deleteReport: (reportId) => {
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== reportId),
        }));
      },

      listReports: (filterOptions) => {
        const state = get();
        let filteredReports = state.reports;

        if (filterOptions?.type) {
          filteredReports = filteredReports.filter(r => r.type === filterOptions.type);
        }

        if (filterOptions?.dateRange) {
          filteredReports = filteredReports.filter(r => {
            const reportDate = new Date(r.createdAt);
            return reportDate >= filterOptions.dateRange!.start && 
                   reportDate <= filterOptions.dateRange!.end;
          });
        }

        if (filterOptions?.author) {
          filteredReports = filteredReports.filter(r => r.createdBy === filterOptions.author);
        }

        if (filterOptions?.tags?.length) {
          filteredReports = filteredReports.filter(r => 
            filterOptions.tags!.some(tag => r.metadata?.tags?.includes(tag))
          );
        }

        return filteredReports;
      },
    }),
    {
      name: 'project-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const { state, version } = JSON.parse(str);
            return { state, version };
          } catch (err) {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
import { useProjectStore } from '../store/projectStore';
import { Task, Status } from '@interface/common';

export const useTasks = () => {
  const store = useProjectStore();

  const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      status: task.status || 'To Do',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.addTask(newTask);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const task = store.getTaskById(taskId);
    if (task) {
      const updatedTask = {
        ...task,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      store.updateTask(updatedTask);
      return updatedTask;
    }
    return null;
  };

  const changeTaskStatus = (taskId: string, newStatus: Status) => {
    store.changeTaskStatus(taskId, newStatus);
  };

  const deleteTask = (taskId: string) => {
    store.deleteTask(taskId);
  };

  const getTasksByProject = (projectId: string) => {
    return store.listTasksByProject(projectId);
  };

  return {
    tasks: store.tasks,
    createTask,
    updateTask,
    changeTaskStatus,
    deleteTask,
    getTasksByProject,
  };
};
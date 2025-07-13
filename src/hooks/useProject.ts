import { useProjectStore } from '../store/projectStore';
import { Project } from '@interface/common';

export const useProjects = () => {
  const store = useProjectStore();

  const createProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.addProject(newProject);
    return newProject;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const project = store.getProjectById(projectId);
    if (project) {
      const updatedProject = {
        ...project,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      store.updateProject(updatedProject);
      return updatedProject;
    }
    return null;
  };

  const deleteProject = (projectId: string) => {
    store.deleteProject(projectId);
  };

  return {
    projects: store.projects,
    createProject,
    updateProject,
    deleteProject,
  };
};
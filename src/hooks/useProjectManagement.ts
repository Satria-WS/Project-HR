import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';

// Define interfaces for your data models
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'Completed';
  startDate: string;
  endDate: string;
  teamMembers: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useProjectManagement() {
  // Use local storage hooks for persistent storage
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', []);

  // Project Management
  const createProject = useCallback((projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      id: uuidv4(),
      ...projectData,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, [setProjects]);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates } 
          : project
      )
    );
  }, [setProjects]);

  const deleteProject = useCallback((projectId: string) => {
    // Remove project
    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    // Remove associated tasks
    setTasks(prev => prev.filter(task => task.projectId !== projectId));
  }, [setProjects, setTasks]);

  // Task Management
  const createTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [setTasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates } 
          : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, [setTasks]);

  // Team Member Management
  const addTeamMember = useCallback((memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      id: uuidv4(),
      ...memberData,
    };
    setTeamMembers(prev => [...prev, newMember]);
    return newMember;
  }, [setTeamMembers]);

  const updateTeamMember = useCallback((memberId: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, ...updates } 
          : member
      )
    );
  }, [setTeamMembers]);

  const deleteTeamMember = useCallback((memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  }, [setTeamMembers]);

  // Utility functions
  const getProjectTasks = useCallback((projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  }, [tasks]);

  const getProjectTeamMembers = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project 
      ? teamMembers.filter(member => project.teamMembers.includes(member.id)) 
      : [];
  }, [projects, teamMembers]);

  return {
    // Projects
    projects,
    createProject,
    updateProject,
    deleteProject,

    // Tasks
    tasks,
    createTask,
    updateTask,
    deleteTask,
    getProjectTasks,

    // Team Members
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getProjectTeamMembers,
  };
}
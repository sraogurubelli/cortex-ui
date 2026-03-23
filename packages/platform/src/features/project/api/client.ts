/**
 * Project API Client
 *
 * Mock implementation using localStorage
 * Replace with real API calls when backend is ready
 */

import type { Project } from '@cortex/core';
import type { CreateProjectRequest, UpdateProjectRequest, ProjectAPI } from './types';

const PROJECTS_STORAGE_KEY = 'cortex_projects';

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to convert API format to domain format
function toDomain(api: ProjectAPI): Project {
  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    description: api.description,
    createdAt: new Date(api.createdAt),
    updatedAt: new Date(api.updatedAt),
  };
}

// Helper to convert domain format to API format
function toAPI(project: Project): ProjectAPI {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

// Get all projects from storage
function getStoredProjects(): ProjectAPI[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save projects to storage
function saveProjects(projects: ProjectAPI[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Ignore storage errors
  }
}

// Initialize with a default project if empty
function initializeProjects(): void {
  const existing = getStoredProjects();
  if (existing.length === 0) {
    const defaultProject: ProjectAPI = {
      id: '1',
      name: 'My Project',
      slug: 'my-project',
      description: 'Default project',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProjects([defaultProject]);
  }
}

// Initialize on load
if (typeof window !== 'undefined') {
  initializeProjects();
}

/**
 * Get all projects
 */
export async function listProjects(): Promise<Project[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const projects = getStoredProjects();
  return projects.map(toDomain);
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const projects = getStoredProjects();
  const found = projects.find(p => p.id === id);
  return found ? toDomain(found) : null;
}

/**
 * Create a new project
 */
export async function createProject(data: CreateProjectRequest): Promise<Project> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const projects = getStoredProjects();

  const newProject: ProjectAPI = {
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    slug: data.slug || generateSlug(data.name),
    description: data.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(newProject);
  saveProjects(projects);

  return toDomain(newProject);
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const projects = getStoredProjects();
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error('Project not found');
  }

  projects[index] = {
    ...projects[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  saveProjects(projects);

  return toDomain(projects[index]);
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const projects = getStoredProjects();
  const filtered = projects.filter(p => p.id !== id);
  saveProjects(filtered);
}

/**
 * Clear all projects (for testing)
 */
export async function clearAllProjects(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROJECTS_STORAGE_KEY);
}

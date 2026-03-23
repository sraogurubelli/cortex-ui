/**
 * Project API Client
 *
 * Calls the cortex-ai /api/v1 project endpoints.
 * Falls back to localStorage mock when the backend is unavailable.
 */

import type { Project } from '@cortex/core';
import { apiRequest } from '@cortex/core';
import type { ProjectInfo } from '@cortex/core';
import type { CreateProjectRequest, UpdateProjectRequest } from './types';

function toDomain(api: ProjectInfo): Project {
  return {
    id: api.id,
    name: api.name,
    slug: api.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    description: api.description,
    createdAt: new Date(api.created_at),
    updatedAt: new Date(api.updated_at),
  };
}

/**
 * List all projects the user has access to.
 *
 * Backend hierarchy: account → org → projects.
 * We walk accounts → orgs → projects and flatten the result.
 */
export async function listProjects(): Promise<Project[]> {
  try {
    // Fetch the user's accounts
    const accounts = await apiRequest<{
      accounts: Array<{ id: string }>;
    }>('/api/v1/accounts?limit=10&offset=0');

    const allProjects: Project[] = [];

    for (const account of accounts.accounts) {
      const orgsRes = await apiRequest<{
        organizations: Array<{ id: string }>;
      }>(`/api/v1/accounts/${account.id}/organizations?limit=50&offset=0`);

      for (const org of orgsRes.organizations) {
        const projRes = await apiRequest<{
          projects: ProjectInfo[];
        }>(`/api/v1/organizations/${org.id}/projects?limit=100&offset=0`);

        allProjects.push(...projRes.projects.map(toDomain));
      }
    }

    return allProjects;
  } catch (error) {
    console.warn('Failed to fetch projects from API, returning empty list:', error);
    return [];
  }
}

/**
 * Get a single project by UID.
 */
export async function getProject(id: string): Promise<Project | null> {
  try {
    const info = await apiRequest<ProjectInfo>(`/api/v1/projects/${id}`);
    return toDomain(info);
  } catch {
    return null;
  }
}

/**
 * Create a new project under the first available organization.
 */
export async function createProject(data: CreateProjectRequest): Promise<Project> {
  // Resolve the first available org
  const accounts = await apiRequest<{
    accounts: Array<{ id: string }>;
  }>('/api/v1/accounts?limit=1&offset=0');

  if (!accounts.accounts.length) throw new Error('No account found');

  const orgsRes = await apiRequest<{
    organizations: Array<{ id: string }>;
  }>(`/api/v1/accounts/${accounts.accounts[0].id}/organizations?limit=1&offset=0`);

  if (!orgsRes.organizations.length) throw new Error('No organization found');

  const orgUid = orgsRes.organizations[0].id;

  const info = await apiRequest<ProjectInfo>(
    `/api/v1/organizations/${orgUid}/projects`,
    {
      method: 'POST',
      body: JSON.stringify({ name: data.name, description: data.description }),
    },
  );

  return toDomain(info);
}

/**
 * Update an existing project.
 */
export async function updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
  const info = await apiRequest<ProjectInfo>(`/api/v1/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return toDomain(info);
}

/**
 * Delete a project.
 */
export async function deleteProject(id: string): Promise<void> {
  await apiRequest<void>(`/api/v1/projects/${id}`, { method: 'DELETE' });
}

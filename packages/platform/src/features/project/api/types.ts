/**
 * Project API types
 */

export interface ProjectAPI {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  slug?: string;
  description?: string;
}

export interface ProjectListResponse {
  projects: ProjectAPI[];
  total: number;
}

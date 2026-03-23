/**
 * Project types and interfaces
 */

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  slug?: string;
  description?: string;
}

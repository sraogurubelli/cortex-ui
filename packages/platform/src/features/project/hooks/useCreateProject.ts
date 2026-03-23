import { useState } from 'react';
import type { Project, CreateProjectInput } from '@cortex/core';
import { createProject } from '../api/client';

/**
 * Hook to create a new project
 */
export function useCreateProject() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: CreateProjectInput): Promise<Project | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const project = await createProject(data);
      return project;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create project');
      setError(error);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    create,
    isCreating,
    error,
  };
}

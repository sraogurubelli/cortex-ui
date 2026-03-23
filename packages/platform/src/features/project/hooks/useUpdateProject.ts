import { useState } from 'react';
import type { Project, UpdateProjectInput } from '@cortex/core';
import { updateProject } from '../api/client';

/**
 * Hook to update a project
 */
export function useUpdateProject() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: UpdateProjectInput): Promise<Project | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      const project = await updateProject(id, data);
      return project;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update project');
      setError(error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    update,
    isUpdating,
    error,
  };
}

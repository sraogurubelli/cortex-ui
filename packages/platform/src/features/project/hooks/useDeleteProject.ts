import { useState } from 'react';
import { deleteProject } from '../api/client';

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteProj = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteProject(id);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete project');
      setError(error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    delete: deleteProj,
    isDeleting,
    error,
  };
}

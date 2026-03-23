import { useProjectContext } from './ProjectContext';

/**
 * Hook to access project context
 * Provides current project and methods to switch projects
 */
export function useProject() {
  return useProjectContext();
}

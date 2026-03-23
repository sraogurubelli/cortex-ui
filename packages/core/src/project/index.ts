/**
 * Project module
 * Provides project context, switcher, and utilities
 */

export { ProjectProvider, useProjectContext } from './ProjectContext';
export type { ProjectContextValue } from './ProjectContext';

export { useProject } from './useProject';

export { ProjectSwitcher } from './ProjectSwitcher';
export type { ProjectSwitcherProps } from './ProjectSwitcher';

export type { Project, CreateProjectInput, UpdateProjectInput } from './types';

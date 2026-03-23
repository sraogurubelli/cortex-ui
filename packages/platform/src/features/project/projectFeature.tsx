import type { HostFeature } from '../../host/types';
import { ProjectListPage } from './pages/ProjectListPage';
import { ProjectSettingsPage } from './pages/ProjectSettingsPage';

/**
 * Project feature descriptor for host registration
 */
export function getProjectFeature(): HostFeature {
  return {
    id: 'projects',
    sectionLabel: 'Projects',
    navItems: [{ path: '/projects', label: 'All Projects', icon: 'folder' }],
    routes: [
      { path: '/projects', element: <ProjectListPage /> },
      { path: '/projects/:id/settings', element: <ProjectSettingsPage /> },
    ],
  };
}

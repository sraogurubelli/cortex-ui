import type { HostFeature } from '../../host/types';
import { ProjectListPage } from './pages/ProjectListPage';
import { ProjectSettingsPage } from './pages/ProjectSettingsPage';

/**
 * Project feature descriptor for host registration.
 * Pass the path prefix the host uses for projects (e.g. '/projects').
 */
export function getProjectFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'projects',
    sectionLabel: 'Projects',
    navItems: [{ path: `${P}`, label: 'All Projects', icon: 'folder' }],
    routes: [
      { path: `${P}`, element: <ProjectListPage /> },
      { path: `${P}/:id/settings`, element: <ProjectSettingsPage /> },
    ],
  };
}

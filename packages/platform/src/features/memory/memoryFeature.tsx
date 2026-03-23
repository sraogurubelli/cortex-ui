import type { HostFeature } from '../../host/types';
import { MemoryPage } from './pages/MemoryPage';

export function getMemoryFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'memory',
    sectionLabel: 'Operations',
    navItems: [{ path: `${P}`, label: 'Memory & RAG', icon: 'database' }],
    routes: [{ path: `${P}`, element: <MemoryPage /> }],
  };
}

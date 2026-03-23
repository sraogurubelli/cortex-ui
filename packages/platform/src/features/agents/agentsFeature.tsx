import type { HostFeature } from '../../host/types';
import { AgentsPage } from './pages/AgentsPage';

export function getAgentsFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'agents',
    sectionLabel: 'Configuration',
    navItems: [{ path: `${P}`, label: 'Agents', icon: 'bot' }],
    routes: [{ path: `${P}`, element: <AgentsPage /> }],
  };
}

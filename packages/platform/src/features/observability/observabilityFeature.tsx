import type { HostFeature } from '../../host/types';
import { ObservabilityPage } from './pages/ObservabilityPage';

export function getObservabilityFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'observability',
    sectionLabel: 'Operations',
    navItems: [{ path: `${P}`, label: 'Observability', icon: 'activity' }],
    routes: [{ path: `${P}`, element: <ObservabilityPage /> }],
  };
}

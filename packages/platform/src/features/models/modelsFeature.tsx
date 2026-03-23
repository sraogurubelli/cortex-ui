import type { HostFeature } from '../../host/types';
import { ModelsPage } from './pages/ModelsPage';

export function getModelsFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'models',
    sectionLabel: 'Configuration',
    navItems: [{ path: `${P}`, label: 'Models', icon: 'cpu' }],
    routes: [{ path: `${P}`, element: <ModelsPage /> }],
  };
}

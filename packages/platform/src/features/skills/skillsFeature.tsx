import type { HostFeature } from '../../host/types';
import { SkillsPage } from './pages/SkillsPage';

export function getSkillsFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'skills',
    sectionLabel: 'Configuration',
    navItems: [{ path: `${P}`, label: 'Skills', icon: 'puzzle' }],
    routes: [{ path: `${P}`, element: <SkillsPage /> }],
  };
}

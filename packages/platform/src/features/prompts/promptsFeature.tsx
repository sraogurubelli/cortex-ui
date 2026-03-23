import type { HostFeature } from '../../host/types';
import { PromptsPage } from './pages/PromptsPage';

/**
 * Prompts feature descriptor for host registration.
 * Pass the path prefix the host uses for prompts (e.g. '/prompts').
 */
export function getPromptsFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'prompts',
    sectionLabel: 'Configuration',
    navItems: [{ path: `${P}`, label: 'Prompts', icon: 'file-code' }],
    routes: [{ path: `${P}`, element: <PromptsPage /> }],
  };
}

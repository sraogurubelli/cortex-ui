import type { HostFeature } from '../../host/types';
import { DocumentsPage } from './pages/DocumentsPage';

/**
 * Documents feature descriptor for host registration.
 * Pass the path prefix the host uses for documents (e.g. '/documents').
 */
export function getDocumentsFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'documents',
    sectionLabel: 'Knowledge',
    navItems: [{ path: `${P}`, label: 'Documents', icon: 'file-text' }],
    routes: [{ path: `${P}`, element: <DocumentsPage /> }],
  };
}

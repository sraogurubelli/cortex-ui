import type { HostFeature } from '../../host/types';
import { ChatPage } from './pages/ChatPage';

/**
 * Chat feature descriptor for host registration.
 * Pass the path prefix the host uses for chat (e.g. '/chat').
 */
export function getChatFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'chat',
    sectionLabel: 'AI Assistant',
    navItems: [{ path: `${P}`, label: 'Chat', icon: 'message-square' }],
    routes: [{ path: `${P}`, element: <ChatPage /> }],
  };
}

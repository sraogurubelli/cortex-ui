import type { HostFeature } from '../../host/types';
import { ProfilePageEnhanced } from './pages/ProfilePageEnhanced';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { APIKeysPage } from './pages/APIKeysPage';

/**
 * Account feature descriptor for host registration.
 * Pass the path prefix the host uses for account (e.g. '/account').
 */
export function getAccountFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'account',
    sectionLabel: 'Account',
    navItems: [
      { path: `${P}/profile`, label: 'Profile', icon: 'user' },
      { path: `${P}/settings`, label: 'Settings', icon: 'settings' },
      { path: `${P}/api-keys`, label: 'API Keys', icon: 'key' },
    ],
    routes: [
      { path: `${P}/profile`, element: <ProfilePageEnhanced /> },
      { path: `${P}/settings`, element: <AccountSettingsPage /> },
      { path: `${P}/api-keys`, element: <APIKeysPage /> },
    ],
  };
}

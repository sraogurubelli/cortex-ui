import type { HostFeature } from '../../host/types';
import { ProfilePage } from './pages/ProfilePage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { APIKeysPage } from './pages/APIKeysPage';

/**
 * Account feature descriptor for host registration
 */
export function getAccountFeature(): HostFeature {
  return {
    id: 'account',
    sectionLabel: 'Account',
    navItems: [
      { path: '/profile', label: 'Profile', icon: 'user' },
      { path: '/settings', label: 'Settings', icon: 'settings' },
      { path: '/api-keys', label: 'API Keys', icon: 'key' },
    ],
    routes: [
      { path: '/profile', element: <ProfilePage /> },
      { path: '/settings', element: <AccountSettingsPage /> },
      { path: '/api-keys', element: <APIKeysPage /> },
    ],
  };
}

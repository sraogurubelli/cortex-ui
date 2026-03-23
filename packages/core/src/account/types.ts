/**
 * Account types and interfaces
 */

import type { Theme } from '../theme';

export interface UserPreferences {
  theme: Theme;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
}

export interface UpdatePreferencesInput {
  theme?: Theme;
  language?: string;
  timezone?: string;
  emailNotifications?: boolean;
  desktopNotifications?: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  emailNotifications: true,
  desktopNotifications: false,
};

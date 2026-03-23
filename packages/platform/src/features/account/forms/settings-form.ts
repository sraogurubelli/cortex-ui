/**
 * Account Settings Form Definition
 *
 * Form definition for user preferences and account settings using @harnessio/forms.
 * Includes field definitions and Zod validation schemas.
 */

import { type IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

/**
 * Account settings form data structure
 */
export interface SettingsFormData {
  theme: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
}

/**
 * Account settings form definition
 *
 * Sections:
 * - Appearance: Theme preference
 * - Localization: Language and timezone
 * - Notifications: Email and desktop notification toggles
 */
export const settingsFormDefinition: IFormDefinition = {
  inputs: [
    // Appearance Section
    {
      inputType: 'select',
      path: 'theme',
      label: 'Theme',
      description: 'Choose your preferred color theme',
      required: true,
      inputConfig: {
        options: [
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
          { label: 'System', value: 'system' },
        ],
      },
      validation: {
        schema: z.enum(['light', 'dark', 'system']),
      },
      default: 'system',
    },

    // Localization Section
    {
      inputType: 'select',
      path: 'language',
      label: 'Language',
      description: 'Select your preferred language',
      required: true,
      inputConfig: {
        options: [
          { label: 'English', value: 'en' },
          { label: 'Spanish', value: 'es' },
          { label: 'French', value: 'fr' },
          { label: 'German', value: 'de' },
        ],
      },
      validation: {
        schema: z.enum(['en', 'es', 'fr', 'de']),
      },
      default: 'en',
    },
    {
      inputType: 'text',
      path: 'timezone',
      label: 'Timezone',
      description: 'Your local timezone',
      placeholder: 'UTC',
      required: true,
      validation: {
        schema: z.string().min(1, 'Timezone is required'),
      },
      default: 'UTC',
    },

    // Notifications Section
    {
      inputType: 'boolean',
      path: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      default: true,
    },
    {
      inputType: 'boolean',
      path: 'desktopNotifications',
      label: 'Desktop Notifications',
      description: 'Show desktop notifications in your browser',
      default: false,
    },
  ],
};

/**
 * Profile Form Definition
 *
 * Form definition for user profile editing using @harnessio/forms.
 * Includes field definitions and Zod validation schemas.
 */

import { type IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

/**
 * Profile form data structure
 */
export interface ProfileFormData {
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Profile form definition
 *
 * Fields:
 * - name: User's full name (required, min 2 characters)
 * - email: User's email address (required, valid email format)
 * - avatar: Avatar URL (optional, valid URL format if provided)
 */
export const profileFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Full Name',
      placeholder: 'John Doe',
      required: true,
      validation: {
        schema: z.string().min(2, 'Name must be at least 2 characters'),
      },
      description: 'Your full name as it will appear across the platform',
    },
    {
      inputType: 'text',
      path: 'email',
      label: 'Email Address',
      placeholder: 'john@example.com',
      required: true,
      validation: {
        schema: z.string().email('Please enter a valid email address'),
      },
      description: 'Your primary email address for notifications and account recovery',
      inputConfig: {
        type: 'email',
      },
    },
    {
      inputType: 'text',
      path: 'avatar',
      label: 'Avatar URL',
      placeholder: 'https://example.com/avatar.jpg',
      required: false,
      validation: {
        schema: z
          .string()
          .url('Please enter a valid URL')
          .optional()
          .or(z.literal('')),
      },
      description: 'Leave empty for auto-generated avatar based on initials',
      inputConfig: {
        type: 'url',
      },
    },
  ],
};

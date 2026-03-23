/**
 * API Key Form Definition
 *
 * Form definition for creating API keys using @harnessio/forms.
 * Includes field definitions and Zod validation schemas.
 */

import { type IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

/**
 * API key form data structure
 */
export interface APIKeyFormData {
  name: string;
  description?: string;
}

/**
 * API key creation form definition
 *
 * Fields:
 * - name: API key name (required, min 3 characters, alphanumeric + spaces/dashes)
 * - description: Optional description of the key's purpose
 */
export const apiKeyFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Key Name',
      placeholder: 'e.g., Production API Key',
      required: true,
      validation: {
        schema: z
          .string()
          .min(3, 'Name must be at least 3 characters')
          .max(50, 'Name must be less than 50 characters')
          .regex(
            /^[a-zA-Z0-9\s\-_]+$/,
            'Name can only contain letters, numbers, spaces, hyphens, and underscores'
          ),
      },
      description: 'A descriptive name to identify this API key',
    },
    {
      inputType: 'textarea',
      path: 'description',
      label: 'Description',
      placeholder: 'What will this key be used for?',
      required: false,
      validation: {
        schema: z.string().max(200, 'Description must be less than 200 characters').optional(),
      },
      description: 'Optional: Describe the purpose or usage of this key',
      inputConfig: {
        rows: 3,
      },
    },
  ],
};

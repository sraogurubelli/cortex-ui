/**
 * Create Project Form Definition
 *
 * Form definition for creating new projects using @harnessio/forms.
 * Includes field definitions and Zod validation schemas.
 */

import { type IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

/**
 * Create project form data structure
 */
export interface CreateProjectFormData {
  name: string;
  slug?: string;
  description?: string;
}

/**
 * Create project form definition
 *
 * Fields:
 * - name: Project name (required, min 3 characters)
 * - slug: URL-friendly identifier (optional, auto-generated if not provided)
 * - description: Project description (optional)
 */
export const createProjectFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Project Name',
      placeholder: 'My Awesome Project',
      required: true,
      validation: {
        schema: z
          .string()
          .min(3, 'Name must be at least 3 characters')
          .max(100, 'Name must be less than 100 characters'),
      },
      description: 'A descriptive name for your project',
    },
    {
      inputType: 'text',
      path: 'slug',
      label: 'Slug (optional)',
      placeholder: 'my-awesome-project',
      required: false,
      validation: {
        schema: z
          .string()
          .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
          .min(3, 'Slug must be at least 3 characters')
          .max(50, 'Slug must be less than 50 characters')
          .optional()
          .or(z.literal('')),
      },
      description: 'Auto-generated from name if not provided',
    },
    {
      inputType: 'textarea',
      path: 'description',
      label: 'Description (optional)',
      placeholder: 'What is this project about?',
      required: false,
      validation: {
        schema: z.string().max(500, 'Description must be less than 500 characters').optional(),
      },
      inputConfig: {
        rows: 3,
      },
    },
  ],
};

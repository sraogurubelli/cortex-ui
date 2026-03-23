// @ts-nocheck
/**
 * Project Settings Form Definitions
 *
 * Form definitions for project settings using @harnessio/forms.
 * Includes general settings and delete confirmation forms.
 */

import { type IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

/**
 * Project settings form data structure
 */
export interface ProjectSettingsFormData {
  name: string;
  slug: string;
  description?: string;
}

/**
 * Delete confirmation form data structure
 */
export interface DeleteConfirmationFormData {
  confirmationText: string;
}

/**
 * Project settings form definition
 *
 * Fields:
 * - name: Project name (required, min 3 characters)
 * - slug: URL-friendly identifier (required)
 * - description: Project description (optional)
 */
export const projectSettingsFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Project Name',
      placeholder: 'My Project',
      required: true,
      validation: {
        schema: z
          .string()
          .min(3, 'Name must be at least 3 characters')
          .max(100, 'Name must be less than 100 characters'),
      },
    },
    {
      inputType: 'text',
      path: 'slug',
      label: 'Slug',
      placeholder: 'my-project',
      required: true,
      validation: {
        schema: z
          .string()
          .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
          .min(3, 'Slug must be at least 3 characters')
          .max(50, 'Slug must be less than 50 characters'),
      },
    },
    {
      inputType: 'textarea',
      path: 'description',
      label: 'Description',
      placeholder: 'Project description',
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

/**
 * Delete confirmation form definition
 *
 * Creates a dynamic form that validates against the actual project name.
 */
export function createDeleteConfirmationFormDefinition(
  projectName: string
): IFormDefinition<any, { projectName: string }> {
  return {
    metadata: { projectName },
    inputs: [
      {
        inputType: 'text',
        path: 'confirmationText',
        label: `Type "${projectName}" to confirm`,
        placeholder: projectName,
        required: true,
        validation: {
          schema: (values, metadata) =>
            z.string().refine((val) => val === metadata?.projectName, {
              message: `Must exactly match "${metadata?.projectName}"`,
            }),
        },
      },
    ],
  };
}

/**
 * Prompt Template Form Definition
 *
 * Form definition for editing prompt templates using @harnessio/forms.
 * Includes field definitions and Zod validation schemas.
 */

import { type IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

/**
 * Prompt template form data structure
 */
export interface PromptTemplateFormData {
  template: string;
}

/**
 * Prompt template editing form definition
 *
 * Fields:
 * - template: Jinja2 template content (required, min 1 character)
 */
export const promptTemplateFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'textarea',
      path: 'template',
      label: 'Template (Jinja2)',
      placeholder: 'Enter your Jinja2 template here...',
      required: true,
      validation: {
        schema: z
          .string()
          .min(1, 'Template cannot be empty')
          .max(10000, 'Template must be less than 10,000 characters'),
      },
      description: 'Jinja2 template with variable placeholders',
      inputConfig: {
        rows: 20,
      },
    },
  ],
};

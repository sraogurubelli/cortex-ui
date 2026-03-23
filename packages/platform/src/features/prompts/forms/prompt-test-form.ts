/**
 * Prompt Test Variables Form Definition
 *
 * Form definition for testing prompt templates with variables using @harnessio/forms.
 * Includes field definitions and Zod validation schemas.
 */

import { type IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

/**
 * Prompt test variables form data structure
 */
export interface PromptTestFormData {
  variables: string;
}

/**
 * JSON validator for test variables
 */
const jsonValidator = z.string().refine(
  (val) => {
    if (!val.trim()) return true; // Empty is OK (defaults to {})
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: 'Must be valid JSON format',
  }
);

/**
 * Prompt test variables form definition
 *
 * Fields:
 * - variables: JSON string of test variables (optional, must be valid JSON)
 */
export const promptTestFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'textarea',
      path: 'variables',
      label: 'Test Variables (JSON)',
      placeholder: '{"agent_name": "assistant", "user_input": "Hello"}',
      required: false,
      validation: {
        schema: jsonValidator,
      },
      description: 'JSON object with test values for template variables',
      inputConfig: {
        rows: 6,
      },
      default: '{}',
    },
  ],
};

/**
 * Helper to parse variables from form
 */
export function parseTestVariables(variablesString: string): Record<string, unknown> {
  const trimmed = variablesString.trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch {
    return {};
  }
}

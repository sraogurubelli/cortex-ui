// @ts-nocheck
/**
 * Scorer Form Definition
 *
 * Form for creating and editing scorers in the Evals feature.
 */

import { IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

export interface ScorerFormValues {
  name: string;
  identifier: string;
  type: string;
  description?: string;
  config?: {
    threshold?: number;
    case_sensitive?: boolean;
    custom_prompt?: string;
  };
}

export const scorerFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Name',
      placeholder: 'Enter scorer name',
      required: true,
      validation: {
        schema: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters')
      }
    },
    {
      inputType: 'text',
      path: 'identifier',
      label: 'Identifier',
      placeholder: 'scorer-identifier',
      description: 'Unique identifier for this scorer',
      required: true,
      validation: {
        schema: z
          .string()
          .min(1, 'Identifier is required')
          .max(50, 'Identifier must be less than 50 characters')
          .regex(/^[a-z0-9-_]+$/, 'Identifier must contain only lowercase letters, numbers, hyphens, and underscores')
      }
    },
    {
      inputType: 'radio',
      path: 'type',
      label: 'Scorer Type',
      required: true,
      default: 'exact_match',
      inputConfig: {
        options: [
          { label: 'Exact Match', value: 'exact_match', description: 'Compares output exactly with expected value' },
          { label: 'Contains', value: 'contains', description: 'Checks if output contains expected substring' },
          { label: 'Semantic Similarity', value: 'semantic', description: 'Measures semantic similarity using embeddings' },
          { label: 'LLM Judge', value: 'llm_judge', description: 'Uses LLM to evaluate output quality' },
          { label: 'Custom', value: 'custom', description: 'Custom scoring logic' }
        ],
        layout: 'vertical'
      },
      validation: {
        schema: z.enum(['exact_match', 'contains', 'semantic', 'llm_judge', 'custom'])
      }
    },
    {
      inputType: 'textarea',
      path: 'description',
      label: 'Description',
      placeholder: 'Describe the purpose of this scorer',
      validation: {
        schema: z.string().max(500, 'Description must be less than 500 characters').optional()
      },
      inputConfig: {
        rows: 3
      }
    },
    {
      inputType: 'group',
      path: '_config',
      label: 'Configuration',
      inputs: [
        {
          inputType: 'number',
          path: 'config.threshold',
          label: 'Threshold',
          description: 'Minimum score to pass (0.0 - 1.0)',
          default: 0.7,
          isVisible: (values) => ['semantic', 'llm_judge'].includes(values.type),
          inputConfig: {
            min: 0,
            max: 1,
            step: 0.1,
            showControls: true
          },
          validation: {
            schema: z.coerce.number().min(0, 'Threshold must be at least 0').max(1, 'Threshold must be at most 1').optional()
          }
        },
        {
          inputType: 'checkbox',
          path: 'config.case_sensitive',
          label: 'Case Sensitive',
          description: 'Enable case-sensitive matching',
          default: false,
          isVisible: (values) => ['exact_match', 'contains'].includes(values.type)
        },
        {
          inputType: 'textarea',
          path: 'config.custom_prompt',
          label: 'Custom Prompt',
          placeholder: 'Enter custom evaluation prompt for LLM judge',
          isVisible: (values) => values.type === 'llm_judge',
          validation: {
            schema: z.string().min(10, 'Prompt must be at least 10 characters').max(2000, 'Prompt must be less than 2000 characters').optional()
          },
          inputConfig: {
            rows: 6
          }
        }
      ]
    }
  ]
};

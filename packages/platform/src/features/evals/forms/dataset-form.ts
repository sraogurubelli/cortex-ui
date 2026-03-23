// @ts-nocheck
/**
 * Dataset Form Definition
 *
 * Form for creating and editing datasets in the Evals feature.
 */

import { IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

export interface DatasetFormValues {
  name: string;
  identifier: string;
  description?: string;
}

export const datasetFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Name',
      placeholder: 'Enter dataset name',
      required: true,
      validation: {
        schema: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters')
      }
    },
    {
      inputType: 'text',
      path: 'identifier',
      label: 'Identifier',
      placeholder: 'dataset-identifier',
      description: 'Unique identifier for this dataset',
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
      inputType: 'textarea',
      path: 'description',
      label: 'Description',
      placeholder: 'Describe the purpose of this dataset',
      validation: {
        schema: z.string().max(500, 'Description must be less than 500 characters').optional()
      },
      inputConfig: {
        rows: 4
      }
    }
  ]
};

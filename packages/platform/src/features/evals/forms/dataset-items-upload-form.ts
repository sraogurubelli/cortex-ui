// @ts-nocheck
/**
 * Dataset Items Upload Form Definition
 *
 * Form for uploading dataset items via file (CSV, JSON, JSONL).
 */

import { IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

export interface DatasetItemsUploadFormValues {
  file: File | null;
  format: 'json' | 'jsonl' | 'csv';
}

export const datasetItemsUploadFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'radio',
      path: 'format',
      label: 'File Format',
      required: true,
      default: 'json',
      inputConfig: {
        options: [
          { label: 'JSON (.json)', value: 'json', description: 'Array of objects in JSON format' },
          { label: 'JSONL (.jsonl)', value: 'jsonl', description: 'One JSON object per line' },
          { label: 'CSV (.csv)', value: 'csv', description: 'Comma-separated values with headers' }
        ],
        layout: 'vertical'
      },
      validation: {
        schema: z.enum(['json', 'jsonl', 'csv'])
      }
    },
    {
      inputType: 'file',
      path: 'file',
      label: 'Upload File',
      required: true,
      description: 'Select a file containing dataset items',
      inputConfig: {
        accept: '.json,.jsonl,.csv',
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
        showPreview: true
      },
      validation: {
        schema: z.instanceof(File, { message: 'Please select a file to upload' })
      }
    }
  ]
};

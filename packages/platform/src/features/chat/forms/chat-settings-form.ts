// @ts-nocheck
/**
 * Chat Settings Form Definition
 *
 * Form for configuring chat model, system prompt, and parameters.
 */

import { IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

export interface ChatSettingsFormValues {
  model: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export const chatSettingsFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'select',
      path: 'model',
      label: 'Model',
      description: 'Select the AI model to use for chat',
      required: true,
      default: 'gpt-4',
      inputConfig: {
        options: [
          { label: 'GPT-4', value: 'gpt-4' },
          { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
          { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
          { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
          { label: 'Claude 3 Opus', value: 'claude-3-opus' },
          { label: 'Claude 3 Haiku', value: 'claude-3-haiku' }
        ]
      },
      validation: {
        schema: z.string().min(1, 'Please select a model')
      }
    },
    {
      inputType: 'textarea',
      path: 'system_prompt',
      label: 'System Prompt',
      placeholder: 'Enter custom system instructions for the AI...',
      description: 'Customize how the AI should behave in this conversation',
      inputConfig: {
        rows: 6
      },
      validation: {
        schema: z.string().max(4000, 'System prompt must be less than 4000 characters').optional()
      }
    },
    {
      inputType: 'group',
      path: '_parameters',
      label: 'Model Parameters',
      inputs: [
        {
          inputType: 'number',
          path: 'temperature',
          label: 'Temperature',
          description: 'Controls randomness: 0 = focused, 1 = creative',
          default: 0.7,
          inputConfig: {
            min: 0,
            max: 1,
            step: 0.1,
            showControls: true
          },
          validation: {
            schema: z.coerce.number().min(0).max(1).optional()
          }
        },
        {
          inputType: 'number',
          path: 'max_tokens',
          label: 'Max Tokens',
          description: 'Maximum length of response',
          default: 2000,
          inputConfig: {
            min: 100,
            max: 8000,
            step: 100,
            showControls: true
          },
          validation: {
            schema: z.coerce.number().min(100).max(8000).optional()
          }
        },
        {
          inputType: 'number',
          path: 'top_p',
          label: 'Top P',
          description: 'Nucleus sampling: lower = more focused',
          default: 1.0,
          inputConfig: {
            min: 0,
            max: 1,
            step: 0.05,
            showControls: true
          },
          validation: {
            schema: z.coerce.number().min(0).max(1).optional()
          }
        },
        {
          inputType: 'checkbox',
          path: 'stream',
          label: 'Enable Streaming',
          description: 'Stream responses word-by-word as they are generated',
          default: true
        }
      ]
    }
  ]
};

// @ts-nocheck
/**
 * Enhanced CreateProjectDialog
 *
 * Modal for creating a new project using @harnessio/forms package with Zod validation.
 * Features:
 * - Type-safe form handling with React Hook Form
 * - Zod schema validation
 * - Canary UI Dialog component
 * - Custom input components
 */

import { Dialog, Button, Text } from '@harnessio/ui/components';
import type { CreateProjectInput } from '@cortex/core';
import {
  RootForm,
  RenderForm,
  collectDefaultValues,
  useZodValidationResolver,
  type RootFormChildrenRendererType,
} from '../../../forms';
import { inputFactory } from '../../../forms/input-factory';
import { createProjectFormDefinition, type CreateProjectFormData } from '../forms';

export interface CreateProjectDialogEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateProjectInput) => Promise<void>;
  isCreating?: boolean;
}

/**
 * CreateProjectDialog - Modal for creating a new project with form validation
 */
export function CreateProjectDialogEnhanced({
  isOpen,
  onClose,
  onCreate,
  isCreating = false,
}: CreateProjectDialogEnhancedProps) {
  // Create validation resolver from form definition
  const resolver = useZodValidationResolver(createProjectFormDefinition, {
    requiredMessage: 'This field is required',
  });

  const defaultValues: CreateProjectFormData = collectDefaultValues(
    createProjectFormDefinition.inputs
  );

  const handleSubmit = async (values: CreateProjectFormData) => {
    try {
      await onCreate({
        name: values.name,
        slug: values.slug || undefined,
        description: values.description || undefined,
      });
      onClose();
    } catch (err) {
      // Error is handled by parent component via onCreate promise rejection
      console.error('Create project error:', err);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create New Project</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          <Text variant="body-normal" className="cn-text-foreground-3 mb-6">
            Create a new project to organize your datasets, scorers, and evaluations.
          </Text>

          <RootForm
            defaultValues={defaultValues}
            resolver={resolver}
            onSubmit={handleSubmit}
            mode="onSubmit"
            validateAfterFirstSubmit={true}
          >
            {(rootForm: RootFormChildrenRendererType<CreateProjectFormData>) => (
              <>
                <div className="space-y-4">
                  <RenderForm factory={inputFactory} formDefinition={createProjectFormDefinition} />
                </div>

                <Dialog.Footer>
                  <Button variant="outline" onClick={onClose} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => rootForm.submitForm()}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create Project'}
                  </Button>
                </Dialog.Footer>
              </>
            )}
          </RootForm>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
}

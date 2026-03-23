// @ts-nocheck
/**
 * Enhanced ProjectSettingsPage
 *
 * Project settings management using @harnessio/forms package with Zod validation.
 * Features:
 * - Type-safe form handling with React Hook Form
 * - Zod schema validation for settings and delete confirmation
 * - Custom input components
 * - Danger zone with validated delete confirmation
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Text } from '@harnessio/ui/components';
import { SettingsLayout, SettingSection, useProject } from '@cortex/core';
import { useUpdateProject, useDeleteProject } from '../hooks';
import { getProject } from '../api/client';
import type { Project } from '@cortex/core';
import {
  RootForm,
  RenderForm,
  collectDefaultValues,
  useZodValidationResolver,
  type RootFormChildrenRendererType,
} from '../../../forms';
import { inputFactory } from '../../../forms/input-factory';
import {
  projectSettingsFormDefinition,
  createDeleteConfirmationFormDefinition,
  type ProjectSettingsFormData,
  type DeleteConfirmationFormData,
} from '../forms';

/**
 * ProjectSettingsPage - Edit project settings with form validation
 */
export function ProjectSettingsPageEnhanced() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { update, isUpdating } = useUpdateProject();
  const { delete: deleteProject, isDeleting } = useDeleteProject();
  const { currentProject, setProjects, switchProject } = useProject();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Create validation resolvers
  const settingsResolver = useZodValidationResolver(projectSettingsFormDefinition, {
    requiredMessage: 'This field is required',
  });

  const deleteResolver = project
    ? useZodValidationResolver(
        createDeleteConfirmationFormDefinition(project.name),
        { requiredMessage: 'This field is required' },
        { projectName: project.name }
      )
    : undefined;

  // Load project
  useEffect(() => {
    async function load() {
      if (!id) return;

      try {
        const data = await getProject(id);
        if (data) {
          setProject(data);
        }
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [id]);

  const handleSettingsSubmit = async (values: ProjectSettingsFormData) => {
    if (!id) return;

    setError('');
    setSuccess('');

    const updated = await update(id, {
      name: values.name,
      slug: values.slug,
      description: values.description,
    });

    if (updated) {
      setSuccess('Project updated successfully');
      setProject(updated);

      // Update project in context if it's the current project
      if (currentProject?.id === id) {
        setProjects((prev: Project[]) => prev.map((p: Project) => (p.id === id ? updated : p)));
      }

      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Failed to update project');
    }
  };

  const handleDelete = async (values: DeleteConfirmationFormData) => {
    if (!id || !project) return;

    const success = await deleteProject(id);

    if (success) {
      // Remove from context
      setProjects((prev: Project[]) => prev.filter((p: Project) => p.id !== id));

      // If this was the current project, switch to another
      if (currentProject?.id === id) {
        switchProject('');
      }

      // Navigate back to projects list
      navigate('/projects');
    } else {
      setError('Failed to delete project');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen cn-bg-background-1">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cn-brand-primary mx-auto mb-4"></div>
          <Text variant="body-normal" className="cn-text-foreground-2">
            Loading project...
          </Text>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen cn-bg-background-1">
        <div className="text-center">
          <Text variant="heading-subsection" className="cn-text-foreground-1 mb-2">
            Project not found
          </Text>
          <Button variant="primary" onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const defaultSettingsValues: ProjectSettingsFormData = {
    name: project.name,
    slug: project.slug,
    description: project.description || '',
  };

  const defaultDeleteValues: DeleteConfirmationFormData = {
    confirmationText: '',
  };

  return (
    <SettingsLayout title={`${project.name} Settings`} description="Manage your project settings">
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-3 rounded-md cn-bg-success-1 border cn-border-success-border">
          <Text variant="body-normal" className="cn-text-success-foreground">
            {success}
          </Text>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-md cn-bg-destructive-1 border cn-border-destructive-border">
          <Text variant="body-normal" className="cn-text-destructive-foreground">
            {error}
          </Text>
        </div>
      )}

      {/* General Settings */}
      <SettingSection title="General" description="Basic project information">
        <RootForm
          defaultValues={defaultSettingsValues}
          resolver={settingsResolver}
          onSubmit={handleSettingsSubmit}
          mode="onSubmit"
          validateAfterFirstSubmit={true}
        >
          {(rootForm: RootFormChildrenRendererType<ProjectSettingsFormData>) => (
            <div className="space-y-4">
              <RenderForm factory={inputFactory} formDefinition={projectSettingsFormDefinition} />
              <Button
                type="button"
                variant="primary"
                onClick={() => rootForm.submitForm()}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </RootForm>
      </SettingSection>

      {/* Danger Zone */}
      <SettingSection title="Danger Zone" description="Irreversible actions">
        {!showDeleteConfirm ? (
          <div className="flex items-start justify-between">
            <div>
              <Text variant="body-strong" className="cn-text-foreground-1 mb-1">
                Delete Project
              </Text>
              <Text variant="body-normal" className="cn-text-foreground-3">
                Permanently delete this project and all its data
              </Text>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="cn-text-destructive-foreground"
            >
              Delete Project
            </Button>
          </div>
        ) : (
          deleteResolver && (
            <RootForm
              defaultValues={defaultDeleteValues}
              resolver={deleteResolver}
              onSubmit={handleDelete}
              mode="onChange"
              metadata={{ projectName: project.name }}
            >
              {(rootForm: RootFormChildrenRendererType<DeleteConfirmationFormData>) => (
                <div className="space-y-4">
                  <div className="p-4 rounded-md cn-bg-destructive-1/50 border cn-border-destructive-border">
                    <Text variant="body-strong" className="cn-text-destructive-foreground mb-2">
                      Are you absolutely sure?
                    </Text>
                    <Text variant="body-normal" className="cn-text-foreground-2 mb-4">
                      This action cannot be undone. This will permanently delete the project and
                      all associated data.
                    </Text>
                    <Text variant="body-normal" className="cn-text-foreground-1 mb-2">
                      Please type <strong>{project.name}</strong> to confirm.
                    </Text>
                    <RenderForm
                      factory={inputFactory}
                      formDefinition={createDeleteConfirmationFormDefinition(project.name)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setError('');
                      }}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => rootForm.submitForm()}
                      disabled={isDeleting || !rootForm.formState.isValid}
                      className="cn-bg-destructive-foreground hover:cn-bg-destructive-foreground/90"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Project'}
                    </Button>
                  </div>
                </div>
              )}
            </RootForm>
          )
        )}
      </SettingSection>
    </SettingsLayout>
  );
}

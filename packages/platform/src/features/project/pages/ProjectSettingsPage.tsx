import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Text } from '@harnessio/ui/components';
import { SettingsLayout, SettingSection, useProject } from '@cortex/core';
import { useUpdateProject, useDeleteProject } from '../hooks';
import { getProject } from '../api/client';
import type { Project } from '@cortex/core';

/**
 * ProjectSettingsPage - Edit project settings
 */
export function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { update, isUpdating } = useUpdateProject();
  const { delete: deleteProject, isDeleting } = useDeleteProject();
  const { currentProject, setProjects, switchProject } = useProject();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Load project
  useEffect(() => {
    async function load() {
      if (!id) return;

      try {
        const data = await getProject(id);
        if (data) {
          setProject(data);
          setName(data.name);
          setSlug(data.slug);
          setDescription(data.description || '');
        }
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!id || !name.trim()) {
      setError('Project name is required');
      return;
    }

    const updated = await update(id, { name, slug, description });

    if (updated) {
      setSuccess('Project updated successfully');
      setProject(updated);

      // Update project in context if it's the current project
      if (currentProject?.id === id) {
        setProjects((prev: Project[]) => prev.map((p: Project) => (p.id === id ? updated : p)));
      }
    } else {
      setError('Failed to update project');
    }
  };

  const handleDelete = async () => {
    if (!id || !project) return;

    if (deleteConfirmText !== project.name) {
      setError('Project name does not match');
      return;
    }

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              <Text variant="body-strong" className="cn-text-foreground-1">
                Project Name
              </Text>
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              disabled={isUpdating}
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              <Text variant="body-strong" className="cn-text-foreground-1">
                Slug
              </Text>
            </label>
            <Input
              type="text"
              value={slug}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
              disabled={isUpdating}
            />
          </div>

          <div>
            <label className="block mb-2">
              <Text variant="body-strong" className="cn-text-foreground-1">
                Description
              </Text>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={isUpdating}
              rows={3}
              className="w-full px-3 py-2 rounded-md border cn-border-border-1 cn-bg-background-1 cn-text-foreground-1 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            />
          </div>

          <Button type="submit" variant="primary" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
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
          <div className="space-y-4">
            <div className="p-4 rounded-md cn-bg-destructive-1/50 border cn-border-destructive-border">
              <Text variant="body-strong" className="cn-text-destructive-foreground mb-2">
                Are you absolutely sure?
              </Text>
              <Text variant="body-normal" className="cn-text-foreground-2 mb-4">
                This action cannot be undone. This will permanently delete the project and all
                associated data.
              </Text>
              <Text variant="body-normal" className="cn-text-foreground-1 mb-2">
                Please type <strong>{project.name}</strong> to confirm.
              </Text>
              <Input
                type="text"
                value={deleteConfirmText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDeleteConfirmText(e.target.value)
                }
                placeholder={project.name}
                disabled={isDeleting}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
                disabled={isDeleting || deleteConfirmText !== project.name}
                className="cn-bg-destructive-foreground hover:cn-bg-destructive-foreground/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </Button>
            </div>
          </div>
        )}
      </SettingSection>
    </SettingsLayout>
  );
}

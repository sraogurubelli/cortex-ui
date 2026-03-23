import { useState, type FormEvent } from 'react';
import { Button, Input, Text, Card } from '@harnessio/ui/components';
import type { CreateProjectInput } from '@cortex/core';

export interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateProjectInput) => Promise<void>;
  isCreating?: boolean;
}

/**
 * CreateProjectDialog - Modal for creating a new project
 */
export function CreateProjectDialog({
  isOpen,
  onClose,
  onCreate,
  isCreating = false,
}: CreateProjectDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      await onCreate({ name, slug: slug || undefined, description: description || undefined });
      // Reset form
      setName('');
      setSlug('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setName('');
      setSlug('');
      setDescription('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 cn-bg-background-1/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <Card.Root className="relative w-full max-w-md p-6 shadow-xl">
        <div className="mb-6">
          <Text variant="heading-subsection" className="cn-text-foreground-1 mb-2">
            Create New Project
          </Text>
          <Text variant="body-normal" className="cn-text-foreground-3">
            Create a new project to organize your datasets, scorers, and evaluations.
          </Text>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md cn-bg-destructive-1 border cn-border-destructive-border">
            <Text variant="body-normal" className="cn-text-destructive-foreground">
              {error}
            </Text>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block mb-2">
              <Text variant="body-strong" className="cn-text-foreground-1">
                Project Name <span className="cn-text-destructive-foreground">*</span>
              </Text>
            </label>
            <Input
              type="text"
              placeholder="My Awesome Project"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              disabled={isCreating}
              required
            />
          </div>

          {/* Slug (optional) */}
          <div>
            <label className="block mb-2">
              <Text variant="body-strong" className="cn-text-foreground-1">
                Slug (optional)
              </Text>
              <Text variant="body-normal" className="cn-text-foreground-3 text-xs">
                Auto-generated from name if not provided
              </Text>
            </label>
            <Input
              type="text"
              placeholder="my-awesome-project"
              value={slug}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
              disabled={isCreating}
            />
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block mb-2">
              <Text variant="body-strong" className="cn-text-foreground-1">
                Description (optional)
              </Text>
            </label>
            <textarea
              placeholder="What is this project about?"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              disabled={isCreating}
              rows={3}
              className="w-full px-3 py-2 rounded-md border cn-border-border-1 cn-bg-background-1 cn-text-foreground-1 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isCreating} className="flex-1">
              {isCreating ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Card.Root>
    </div>
  );
}

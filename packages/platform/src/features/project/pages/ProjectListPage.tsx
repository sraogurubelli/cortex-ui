import { useState, useEffect } from 'react';
import { Button, Text, IconV2 } from '@harnessio/ui/components';
import { useProject } from '@cortex/core';
import { useProjects, useCreateProject } from '../hooks';
import { ProjectCard } from '../components/ProjectCard';
import { CreateProjectDialog } from '../components/CreateProjectDialog';

/**
 * ProjectListPage - Display all projects with create functionality
 */
export function ProjectListPage() {
  const { projects, isLoading, error, refetch } = useProjects();
  const { create, isCreating } = useCreateProject();
  const { setProjects: setContextProjects, switchProject } = useProject();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Sync projects with context when they load
  useEffect(() => {
    if (projects.length > 0) {
      setContextProjects(projects);
    }
  }, [projects, setContextProjects]);

  const handleCreate = async (data: { name: string; slug?: string; description?: string }) => {
    const project = await create(data);
    if (project) {
      await refetch(); // Refresh the list
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen cn-bg-background-1">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cn-brand-primary mx-auto mb-4"></div>
          <Text variant="body-normal" className="cn-text-foreground-2">
            Loading projects...
          </Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen cn-bg-background-1">
        <div className="text-center max-w-md">
          <IconV2
            name={'alert-circle' as any}
            size="lg"
            className="cn-text-destructive-foreground mb-4"
          />
          <Text variant="heading-subsection" className="cn-text-foreground-1 mb-2">
            Failed to load projects
          </Text>
          <Text variant="body-normal" className="cn-text-foreground-3 mb-4">
            {error.message}
          </Text>
          <Button variant="primary" onClick={refetch}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cn-bg-background-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Text variant="heading-section" className="cn-text-foreground-1 mb-2">
              Projects
            </Text>
            <Text variant="body-normal" className="cn-text-foreground-3">
              Manage your projects and their settings
            </Text>
          </div>
          <Button variant="primary" onClick={() => setIsCreateDialogOpen(true)}>
            <IconV2 name={'plus' as any} size="sm" className="mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <IconV2
              name={'folder' as any}
              size="lg"
              className="cn-text-foreground-3 mb-4 mx-auto"
            />
            <Text variant="heading-subsection" className="cn-text-foreground-1 mb-2">
              No projects yet
            </Text>
            <Text variant="body-normal" className="cn-text-foreground-3 mb-6">
              Get started by creating your first project
            </Text>
            <Button variant="primary" onClick={() => setIsCreateDialogOpen(true)}>
              <IconV2 name={'plus' as any} size="sm" className="mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} onSelect={p => switchProject(p.id)} />
            ))}
          </div>
        )}

        {/* Create Dialog */}
        <CreateProjectDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreate={handleCreate}
          isCreating={isCreating}
        />
      </div>
    </div>
  );
}

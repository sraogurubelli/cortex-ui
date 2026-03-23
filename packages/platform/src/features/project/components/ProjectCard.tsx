import { Link } from 'react-router-dom';
import { Text, Card, IconV2 } from '@harnessio/ui/components';
import type { Project } from '@cortex/core';

export interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
}

/**
 * ProjectCard - Display a project as a card
 */
export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const formattedDate = project.updatedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card.Root className="hover:shadow-lg transition-shadow cursor-pointer">
      <Link
        to={`/projects/${project.id}/settings`}
        onClick={() => onSelect?.(project)}
        className="block p-6"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg cn-bg-brand-primary/10 flex items-center justify-center">
              <IconV2 name={'folder' as any} size="sm" className="cn-text-brand-primary" />
            </div>
            <div>
              <Text variant="heading-subsection" className="cn-text-foreground-1">
                {project.name}
              </Text>
              <Text variant="body-normal" className="cn-text-foreground-3 text-xs">
                {project.slug}
              </Text>
            </div>
          </div>
        </div>

        {project.description && (
          <Text variant="body-normal" className="cn-text-foreground-2 mb-4 line-clamp-2">
            {project.description}
          </Text>
        )}

        <div className="flex items-center justify-between pt-4 border-t cn-border-border-1">
          <Text variant="body-normal" className="cn-text-foreground-3 text-xs">
            Updated {formattedDate}
          </Text>
          <IconV2 name={'chevron-right' as any} size="sm" className="cn-text-foreground-3" />
        </div>
      </Link>
    </Card.Root>
  );
}

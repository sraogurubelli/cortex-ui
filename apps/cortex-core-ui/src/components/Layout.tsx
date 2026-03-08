import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@harnessio/ui/components';
import { AppShell, ProjectSwitcher, type NavSection, type Project } from '@cortex/core';
import type { HostFeature } from '@cortex/platform';

interface LayoutProps {
  children: React.ReactNode;
  features: HostFeature[];
}

// TODO: from context/API
const PROJECTS: Project[] = [
  { id: '1', name: 'My Project' },
];

export default function Layout({ children, features }: LayoutProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(PROJECTS[0]);

  // Convert HostFeature[] to NavSection[]
  const sections: NavSection[] = features.map((feature) => ({
    id: feature.id,
    sectionLabel: feature.sectionLabel,
    navItems: feature.navItems,
  }));

  return (
    <AppShell
      appName="Cortex"
      sections={sections}
      projectSwitcher={
        <ProjectSwitcher
          projects={PROJECTS}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onCreateProject={() => {
            // TODO: Implement create project
            console.log('Create project clicked');
          }}
        />
      }
      headerActions={
        <Link to="/signin">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
      }
    >
      {children}
    </AppShell>
  );
}

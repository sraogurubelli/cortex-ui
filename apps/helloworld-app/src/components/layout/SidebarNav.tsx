import { Sidebar, IconV2, Text, Layout, Progress } from '@harnessio/ui/components';
import type { IconV2NamesType } from '@harnessio/ui/components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ScopeSelector } from '../scope-selector';
import type { Organization, Project } from '../scope-selector';

interface NavItem {
  title: string;
  icon: IconV2NamesType;
  to: string;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', icon: 'dashboard', to: '/' },
  { title: 'Agents', icon: 'ai-ml-ops', to: '/agents' },
  { title: 'Evaluations', icon: 'target', to: '/evaluations' },
  { title: 'Conversations', icon: 'code-chat', to: '/conversations' },
];

const organizations: Organization[] = [
  { id: 'org-1', name: 'AI Platform', description: 'Main AI Platform organization' },
  { id: 'org-2', name: 'ML Team', description: 'Machine Learning team' },
];

const projects: Project[] = [
  { id: 'proj-1', name: 'My Project', orgId: 'org-1', orgName: 'AI Platform' },
  { id: 'proj-2', name: 'Production Evals', orgId: 'org-1', orgName: 'AI Platform' },
  { id: 'proj-3', name: 'Staging Tests', orgId: 'org-1', orgName: 'AI Platform' },
  { id: 'proj-4', name: 'Research Project', orgId: 'org-2', orgName: 'ML Team' },
];

export function SidebarNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(organizations[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Sidebar.Header className="p-cn-md">
        <Layout.Horizontal gap="sm" align="center" className="mb-cn-md">
          <IconV2 name="ai-ml-ops" size="md" className="text-cn-brand" />
          <Text variant="body-single-line-strong" color="foreground-1">
            Cortex UI Hello World
          </Text>
        </Layout.Horizontal>
        <ScopeSelector
          organizations={organizations}
          projects={projects}
          selectedOrg={selectedOrg}
          selectedProject={selectedProject}
          onOrgChange={setSelectedOrg}
          onProjectChange={setSelectedProject}
        />
      </Sidebar.Header>

      <Sidebar.Content>
        <Sidebar.Group>
          {navItems.map((item) => (
            <Sidebar.Item
              key={item.to}
              title={item.title}
              icon={item.icon}
              to={item.to}
              active={isActive(item.to)}
              onClick={() => navigate(item.to)}
            />
          ))}
        </Sidebar.Group>
      </Sidebar.Content>

      <Sidebar.Footer className="p-cn-md border-t border-cn-border-1">
        <Layout.Vertical gap="sm">
          <Layout.Horizontal justify="between" align="center">
            <Text variant="body-single-line-normal" color="foreground-2">
              Free plan usage
            </Text>
            <IconV2 name="arrow-up-right" size="xs" className="text-cn-foreground-3" />
          </Layout.Horizontal>
          <Progress value={0} label="Logs" subtitle="0 of 1 GB" size="sm" hideIcon />
          <Progress value={0} label="Scores" subtitle="0 of 10,000" size="sm" hideIcon />
        </Layout.Vertical>
      </Sidebar.Footer>

      <Sidebar.Rail />
    </>
  );
}

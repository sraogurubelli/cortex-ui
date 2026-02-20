import { useState, useMemo } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  IconV2,
  ScrollArea,
  SearchInput,
  StackedList,
  Tabs,
  Text,
} from '@harnessio/ui/components';
import type { Organization, Project, ScopeItem } from './types';
import { RecentScopes, saveRecentScope } from './recent-scopes';

interface ScopeSelectorProps {
  organizations: Organization[];
  projects: Project[];
  selectedOrg?: Organization | null;
  selectedProject?: Project | null;
  onOrgChange: (org: Organization) => void;
  onProjectChange: (project: Project) => void;
}

const ScopeSelectorTabContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ScrollArea className="w-full max-h-[calc(385px-48px)]">{children}</ScrollArea>
);

export function ScopeSelector({
  organizations,
  projects,
  selectedOrg,
  selectedProject,
  onOrgChange,
  onProjectChange,
}: ScopeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    const term = searchTerm.toLowerCase();
    return projects.filter(
      (p) => p.name.toLowerCase().includes(term) || p.orgName?.toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  const filteredOrgs = useMemo(() => {
    if (!searchTerm) return organizations;
    const term = searchTerm.toLowerCase();
    return organizations.filter((o) => o.name.toLowerCase().includes(term));
  }, [organizations, searchTerm]);

  const handleProjectSelect = (project: Project) => {
    const org = organizations.find((o) => o.id === project.orgId);
    if (org) onOrgChange(org);
    onProjectChange(project);
    saveRecentScope({
      id: project.id,
      name: project.name,
      type: 'project',
      icon: 'folder',
      path: [project.orgName || project.orgId],
    });
    setOpen(false);
    setSearchTerm('');
  };

  const handleOrgSelect = (org: Organization) => {
    onOrgChange(org);
    saveRecentScope({ id: org.id, name: org.name, type: 'organization', icon: 'organizations' });
    setOpen(false);
    setSearchTerm('');
  };

  const handleRecentSelect = (scope: ScopeItem) => {
    if (scope.type === 'project') {
      const project = projects.find((p) => p.id === scope.id);
      if (project) handleProjectSelect(project);
    } else {
      const org = organizations.find((o) => o.id === scope.id);
      if (org) handleOrgSelect(org);
    }
  };

  const displayName = selectedProject?.name || selectedOrg?.name || 'Select Scope';
  const displayPath = selectedProject && selectedOrg ? selectedOrg.name : undefined;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSearchTerm('');
      }}
    >
      <Dialog.Trigger>
        <Button
          variant="ghost"
          className="w-full justify-start gap-cn-xs p-cn-xs h-auto hover:bg-cn-background-hover rounded-cn-2"
        >
          <Avatar size="lg" icon="organizations" rounded />
          <div className="flex flex-col items-start flex-1 min-w-0">
            {displayPath && (
              <Text variant="caption-single-line-normal" color="foreground-3" truncate>
                {displayPath}
              </Text>
            )}
            <Text variant="body-single-line-strong" truncate className="max-w-full">
              {displayName}
            </Text>
          </div>
          <IconV2 name="nav-arrow-right" size="xs" className="text-cn-foreground-3" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="max-w-[400px]">
        <Dialog.Header>
          <Dialog.Title>Select Scope</Dialog.Title>
          <Dialog.Description className="mt-cn-sm">
            <SearchInput
              placeholder="Search projects and organizations..."
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
            />
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="mt-cn-xs p-0" scrollable={false}>
          {searchTerm.length > 0 ? (
            <ScrollArea className="max-h-96 px-cn-md">
              {filteredProjects.length > 0 && (
                <div className="mb-cn-md">
                  <Text
                    variant="caption-single-line-normal"
                    color="foreground-3"
                    className="px-cn-xs mb-cn-xs block"
                  >
                    PROJECTS
                  </Text>
                  <StackedList.Root className="border-none">
                    {filteredProjects.map((project) => (
                      <StackedList.Item
                        key={project.id}
                        thumbnail={<IconV2 name="folder" size="md" />}
                        paddingX="xs"
                        paddingY="xs"
                        onClick={() => handleProjectSelect(project)}
                        className="border-none rounded-cn-3 cursor-pointer hover:bg-cn-background-hover"
                      >
                        <StackedList.Field
                          title={project.name}
                          description={
                            <Text color="foreground-3" variant="caption-single-line-normal">
                              {project.orgName || project.orgId}
                            </Text>
                          }
                          className="gap-0"
                        />
                      </StackedList.Item>
                    ))}
                  </StackedList.Root>
                </div>
              )}
              {filteredOrgs.length > 0 && (
                <div>
                  <Text
                    variant="caption-single-line-normal"
                    color="foreground-3"
                    className="px-cn-xs mb-cn-xs block"
                  >
                    ORGANIZATIONS
                  </Text>
                  <StackedList.Root className="border-none">
                    {filteredOrgs.map((org) => (
                      <StackedList.Item
                        key={org.id}
                        thumbnail={<IconV2 name="organizations" size="md" />}
                        paddingX="xs"
                        paddingY="md"
                        onClick={() => handleOrgSelect(org)}
                        className="border-none rounded-cn-3 cursor-pointer hover:bg-cn-background-hover"
                      >
                        <StackedList.Field title={org.name} className="gap-0" />
                      </StackedList.Item>
                    ))}
                  </StackedList.Root>
                </div>
              )}
              {filteredProjects.length === 0 && filteredOrgs.length === 0 && (
                <div className="p-cn-lg text-center">
                  <Text color="foreground-3">No results found</Text>
                </div>
              )}
            </ScrollArea>
          ) : (
            <Tabs.Root defaultValue="recent" className="w-full">
              <Tabs.List className="px-cn-md">
                <Tabs.Trigger value="recent" icon="clock">
                  Recent
                </Tabs.Trigger>
                <Tabs.Trigger value="all" icon="list">
                  All
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="recent" className="mt-cn-xs px-cn-md">
                <ScopeSelectorTabContent>
                  <RecentScopes onSelect={handleRecentSelect} />
                </ScopeSelectorTabContent>
              </Tabs.Content>
              <Tabs.Content value="all" className="mt-cn-xs px-cn-md">
                <ScopeSelectorTabContent>
                  <div className="mb-cn-md">
                    <Text
                      variant="caption-single-line-normal"
                      color="foreground-3"
                      className="px-cn-xs mb-cn-xs block"
                    >
                      ORGANIZATIONS
                    </Text>
                    <StackedList.Root className="border-none">
                      {organizations.map((org) => (
                        <StackedList.Item
                          key={org.id}
                          thumbnail={<IconV2 name="organizations" size="md" />}
                          paddingX="xs"
                          paddingY="md"
                          onClick={() => handleOrgSelect(org)}
                          className="border-none rounded-cn-3 cursor-pointer hover:bg-cn-background-hover"
                        >
                          <StackedList.Field title={org.name} className="gap-0" />
                          {selectedOrg?.id === org.id && (
                            <StackedList.Field
                              title={<IconV2 name="check" size="xs" className="text-cn-brand" />}
                              right
                            />
                          )}
                        </StackedList.Item>
                      ))}
                    </StackedList.Root>
                  </div>
                  <div>
                    <Text
                      variant="caption-single-line-normal"
                      color="foreground-3"
                      className="px-cn-xs mb-cn-xs block"
                    >
                      PROJECTS
                    </Text>
                    <StackedList.Root className="border-none">
                      {projects.map((project) => (
                        <StackedList.Item
                          key={project.id}
                          thumbnail={<IconV2 name="folder" size="md" />}
                          paddingX="xs"
                          paddingY="xs"
                          onClick={() => handleProjectSelect(project)}
                          className="border-none rounded-cn-3 cursor-pointer hover:bg-cn-background-hover"
                        >
                          <StackedList.Field
                            title={project.name}
                            description={
                              <Text color="foreground-3" variant="caption-single-line-normal">
                                {project.orgName || project.orgId}
                              </Text>
                            }
                            className="gap-0"
                          />
                          {selectedProject?.id === project.id && (
                            <StackedList.Field
                              title={<IconV2 name="check" size="xs" className="text-cn-brand" />}
                              right
                            />
                          )}
                        </StackedList.Item>
                      ))}
                    </StackedList.Root>
                  </div>
                </ScopeSelectorTabContent>
              </Tabs.Content>
            </Tabs.Root>
          )}
        </Dialog.Body>
        <Dialog.Footer className="border-t border-cn-border-1 mt-cn-md">
          <Button variant="link" className="w-full justify-start" onClick={() => setOpen(false)}>
            <IconV2 name="settings" size="sm" />
            <Text>Select Another Scope</Text>
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

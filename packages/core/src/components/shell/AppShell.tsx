import { useLocation } from 'react-router-dom';
import { Sidebar, Layout, Text } from '@harnessio/ui/components';
import { useState, useEffect } from 'react';
import type { IconV2NamesType } from '@harnessio/ui/components';

export interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

export interface NavSection {
  id: string;
  sectionLabel: string;
  navItems: NavItem[];
}

export interface AppShellProps {
  children: React.ReactNode;
  sections?: NavSection[];
  appName?: string;
  projectSwitcher?: React.ReactNode;
  headerActions?: React.ReactNode;
  defaultSidebarOpen?: boolean;
}

const SIDEBAR_STATE_KEY = 'cortex_sidebar_open';

/**
 * AppShell - Application layout with collapsible sidebar
 *
 * Provides:
 * - Collapsible left sidebar with project switcher and navigation
 * - Main content area
 * - Sidebar state persistence
 */
export function AppShell({
  children,
  sections = [],
  appName: _appName,
  projectSwitcher,
  headerActions: _headerActions,
  defaultSidebarOpen = true,
}: AppShellProps) {
  const location = useLocation();

  // Load sidebar state from localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return defaultSidebarOpen;
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
    return stored !== null ? stored === 'true' : defaultSidebarOpen;
  });

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <div className="flex flex-1 min-h-0">
      <Sidebar.Provider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <Sidebar.Root side="left">
          <Sidebar.Content>
            <Layout.Flex direction="column" gap="none">
              {/* Project Switcher */}
              {projectSwitcher && (
                <Sidebar.Header className="p-cn-md border-b">{projectSwitcher}</Sidebar.Header>
              )}

              {/* Navigation Sections */}
              {sections.map(section => (
                <Sidebar.Group key={section.id}>
                  <Text variant="body-normal" className="px-cn-md py-cn-xs" color="foreground-3">
                    {section.sectionLabel}
                  </Text>
                  {section.navItems.map(({ path, label, icon }) => {
                    const isActive =
                      location.pathname === path || location.pathname.startsWith(path + '/');

                    return (
                      <Sidebar.Item
                        key={path}
                        title={label}
                        icon={icon as IconV2NamesType}
                        to={path}
                        active={isActive}
                      />
                    );
                  })}
                </Sidebar.Group>
              ))}
            </Layout.Flex>
          </Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>

      {/* Main Content */}
      <main className="flex-1 overflow-auto cn-bg-background-1">{children}</main>
    </div>
  );
}

/**
 * Hook to access sidebar state
 */
export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  return { sidebarOpen, setSidebarOpen };
}

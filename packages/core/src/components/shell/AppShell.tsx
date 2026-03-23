import { Link, useLocation } from 'react-router-dom';
import { Sidebar, Text, IconV2 } from '@harnessio/ui/components';
import { useState, useEffect } from 'react';

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
  appName,
  projectSwitcher,
  headerActions,
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
        <Sidebar.Root side="left" className="border-r cn-border-border-1">
          <Sidebar.Content>
            {/* Project Switcher */}
            {projectSwitcher && (
              <Sidebar.Header className="pb-4 border-b cn-border-border-1">
                {projectSwitcher}
              </Sidebar.Header>
            )}

            {/* Navigation Sections */}
            {sections.map(section => (
              <Sidebar.Group key={section.id} className="px-3 py-4">
                <Text variant="heading-small" className="mb-2 px-3 uppercase cn-text-foreground-3">
                  {section.sectionLabel}
                </Text>
                <div className="space-y-1">
                  {section.navItems.map(({ path, label, icon }) => {
                    const isActive =
                      location.pathname === path || location.pathname.startsWith(path + '/');

                    return (
                      <Link
                        key={path}
                        to={path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                            ${
                              isActive
                                ? 'cn-bg-brand-primary cn-text-white'
                                : 'cn-text-foreground-2 hover:cn-bg-background-3'
                            }`}
                      >
                        {icon && (
                          <IconV2
                            name={icon as any}
                            size="sm"
                            className={isActive ? 'text-white' : 'cn-text-foreground-3'}
                          />
                        )}
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </Sidebar.Group>
            ))}
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

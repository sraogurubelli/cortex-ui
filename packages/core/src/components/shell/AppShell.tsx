import { Link, useLocation } from 'react-router-dom';
import { Text } from '@harnessio/ui/components';

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
}

/**
 * AppShell - Main application shell using Canary Sidebar component
 *
 * Provides a consistent layout with:
 * - Top header with app name and actions
 * - Left sidebar with project switcher and navigation
 * - Main content area
 */
export function AppShell({
  children,
  sections = [],
  appName = 'Cortex',
  projectSwitcher,
  headerActions,
}: AppShellProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col cn-bg-background-1">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b cn-border-border-1 cn-bg-background-2 px-6">
        <Text variant="heading-base" className="cn-text-foreground-1">
          {appName}
        </Text>
        {headerActions}
      </header>

      {/* Body with Sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-60 border-r cn-border-border-1 cn-bg-background-2 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {/* Project Switcher */}
            {projectSwitcher && (
              <div className="mb-4 pb-4 border-b cn-border-border-1">
                {projectSwitcher}
              </div>
            )}

            {/* Navigation Sections */}
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                <Text
                  variant="heading-small"
                  className="mb-2 px-3 uppercase cn-text-foreground-3"
                >
                  {section.sectionLabel}
                </Text>
                <nav className="space-y-1">
                  {section.navItems.map(({ path, label }) => {
                    const isActive = location.pathname.startsWith(path);
                    return (
                      <Link
                        key={path}
                        to={path}
                        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${
                            isActive
                              ? 'cn-bg-brand-primary cn-text-white'
                              : 'cn-text-foreground-2 hover:cn-bg-background-3'
                          }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto cn-bg-background-1">
          {children}
        </main>
      </div>
    </div>
  );
}

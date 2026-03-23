import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Text,
  Avatar,
  DropdownMenu,
  Topbar,
  IconV2,
  SearchInput,
  Separator,
} from '@harnessio/ui/components';
import {
  AppShell,
  ProjectSwitcher,
  type NavSection,
  type Project,
  useAuth,
  useTheme,
  useNotifications,
  useProject,
  type Theme,
  generateBreadcrumbs,
  type FeatureInfo,
  useSidebarState,
} from '@cortex/core';
import type { HostFeature } from '@cortex/platform';

interface LayoutProps {
  children: React.ReactNode;
  features: HostFeature[];
}

export default function Layout({ children, features }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { sidebarOpen, setSidebarOpen } = useSidebarState();
  const { projects, currentProject, switchProject } = useProject();

  const [searchQuery, setSearchQuery] = useState('');

  // Convert HostFeature[] to NavSection[]
  const sections: NavSection[] = features.map(feature => ({
    id: feature.id,
    sectionLabel: feature.sectionLabel,
    navItems: feature.navItems,
  }));

  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs(location.pathname, features as FeatureInfo[]);

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search functionality
    console.log('Search query:', query);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Bar */}
      <Topbar.Root className="h-14 border-b cn-border-border-1 cn-bg-background-2 px-6">
        {/* Left: Sidebar Toggle + Breadcrumbs */}
        <Topbar.Left>
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md hover:cn-bg-background-3 transition-colors cn-text-foreground-2"
              aria-label="Toggle sidebar"
            >
              <IconV2
                name={sidebarOpen ? ('panel-left-close' as any) : ('panel-left-open' as any)}
                size="sm"
              />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center gap-2">
                  {index > 0 && (
                    <IconV2
                      name={'chevron-right' as any}
                      size="xs"
                      className="cn-text-foreground-3"
                    />
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <Text variant="body-normal" className="cn-text-foreground-1 font-medium">
                      {crumb.label}
                    </Text>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="cn-text-foreground-2 hover:cn-text-foreground-1 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </Topbar.Left>

        {/* Center: Search */}
        <Topbar.Center>
          <div className="w-full max-w-md">
            <SearchInput
              placeholder="Search..."
              value={searchQuery}
              onChange={value => setSearchQuery(value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
            />
          </div>
        </Topbar.Center>

        {/* Right: Notifications, Theme Switcher, User Menu */}
        <Topbar.Right>
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="relative p-2 rounded-md hover:cn-bg-background-3 transition-colors cn-text-foreground-2">
                  <IconV2 name="bell" size="sm" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full cn-bg-destructive-foreground" />
                  )}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end" className="w-80">
                <DropdownMenu.Header>
                  <div className="flex items-center justify-between">
                    <Text variant="body-strong">Notifications</Text>
                    {unreadCount > 0 && (
                      <Button variant="link" size="sm" onClick={markAllAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </div>
                </DropdownMenu.Header>
                <DropdownMenu.Separator />
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <IconV2 name="bell-off" size="lg" className="cn-text-foreground-3 mb-2" />
                    <Text variant="body-normal" className="cn-text-foreground-3">
                      No notifications
                    </Text>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map(notif => (
                      <DropdownMenu.Item
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className="flex flex-col items-start gap-1 p-3"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Text variant="body-strong" className="flex-1">
                            {notif.title}
                          </Text>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full cn-bg-brand-primary" />
                          )}
                        </div>
                        <Text variant="body-normal" className="cn-text-foreground-3 text-sm">
                          {notif.message}
                        </Text>
                        <Text variant="body-normal" className="cn-text-foreground-3 text-xs">
                          {new Date(notif.timestamp).toLocaleString()}
                        </Text>
                      </DropdownMenu.Item>
                    ))}
                  </div>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Theme Switcher */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-2 rounded-md hover:cn-bg-background-3 transition-colors cn-text-foreground-2">
                  <IconV2
                    name={actualTheme === 'dark' ? ('moon' as any) : ('sun' as any)}
                    size="sm"
                  />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Header>
                  <Text variant="body-strong">Theme</Text>
                </DropdownMenu.Header>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={() => handleThemeChange('light')}>
                  <div className="flex items-center gap-2">
                    <IconV2 name={'sun' as any} size="sm" />
                    <span>Light</span>
                    {theme === 'light' && (
                      <IconV2 name={'check' as any} size="sm" className="ml-auto" />
                    )}
                  </div>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleThemeChange('dark')}>
                  <div className="flex items-center gap-2">
                    <IconV2 name={'moon' as any} size="sm" />
                    <span>Dark</span>
                    {theme === 'dark' && (
                      <IconV2 name={'check' as any} size="sm" className="ml-auto" />
                    )}
                  </div>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleThemeChange('system')}>
                  <div className="flex items-center gap-2">
                    <IconV2 name={'monitor' as any} size="sm" />
                    <span>System</span>
                    {theme === 'system' && (
                      <IconV2 name={'check' as any} size="sm" className="ml-auto" />
                    )}
                  </div>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <Separator orientation="vertical" className="h-6" />

            {/* User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:cn-bg-background-3 transition-colors">
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <div className="text-left hidden md:block">
                      <Text variant="body-strong" className="cn-text-foreground-1 text-sm">
                        {user.name}
                      </Text>
                      <Text variant="body-normal" className="cn-text-foreground-3 text-xs">
                        {user.email}
                      </Text>
                    </div>
                    <IconV2
                      name={'chevron-down' as any}
                      size="xs"
                      className="cn-text-foreground-3"
                    />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" className="w-56">
                  <DropdownMenu.Header>
                    <Text variant="body-strong" className="cn-text-foreground-1">
                      {user.name}
                    </Text>
                    <Text variant="body-normal" className="cn-text-foreground-3 text-sm">
                      {user.email}
                    </Text>
                  </DropdownMenu.Header>
                  <DropdownMenu.Separator />
                  <DropdownMenu.IconItem icon="user" onClick={() => navigate('/profile')}>
                    View Profile
                  </DropdownMenu.IconItem>
                  <DropdownMenu.IconItem icon="settings" onClick={() => navigate('/settings')}>
                    Settings
                  </DropdownMenu.IconItem>
                  <DropdownMenu.Separator />
                  <DropdownMenu.IconItem
                    icon="logout"
                    onClick={handleLogout}
                    className="cn-text-destructive-foreground"
                  >
                    Sign out
                  </DropdownMenu.IconItem>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : (
              <Link to="/signin">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </Topbar.Right>
      </Topbar.Root>

      {/* App Shell with Sidebar and Main Content */}
      <AppShell
        appName="Cortex"
        sections={sections}
        projectSwitcher={
          <ProjectSwitcher
            projects={projects}
            selectedProject={currentProject}
            onSelectProject={project => switchProject(project.id)}
            onCreateProject={() => {
              navigate('/projects');
            }}
          />
        }
        headerActions={null} // Header actions now in Topbar above
      >
        {children}
      </AppShell>
    </div>
  );
}

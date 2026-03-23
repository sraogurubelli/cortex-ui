import { Text } from '@harnessio/ui/components';

export interface SettingsLayoutProps {
  children: React.ReactNode;
  navigation?: React.ReactNode;
  title?: string;
  description?: string;
}

/**
 * SettingsLayout - Main layout for settings pages
 *
 * Provides a consistent structure with:
 * - Optional sidebar navigation
 * - Title and description area
 * - Content area for settings
 */
export function SettingsLayout({ children, navigation, title, description }: SettingsLayoutProps) {
  return (
    <div className="flex min-h-screen cn-bg-background-1">
      {/* Sidebar Navigation */}
      {navigation && (
        <aside className="w-64 border-r cn-border-border-1 cn-bg-background-2 p-6">
          {navigation}
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <Text variant="heading-section" className="cn-text-foreground-1 mb-2">
                  {title}
                </Text>
              )}
              {description && (
                <Text variant="body-normal" className="cn-text-foreground-2">
                  {description}
                </Text>
              )}
            </div>
          )}

          {/* Content */}
          {children}
        </div>
      </main>
    </div>
  );
}

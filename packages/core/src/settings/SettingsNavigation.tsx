import { Link, useLocation } from 'react-router-dom';
import { Text, IconV2 } from '@harnessio/ui/components';
import type { SettingsSection } from './types';

export interface SettingsNavigationProps {
  sections: SettingsSection[];
  title?: string;
}

/**
 * SettingsNavigation - Sidebar navigation for settings pages
 *
 * Displays a list of settings sections with active state tracking
 */
export function SettingsNavigation({ sections, title = 'Settings' }: SettingsNavigationProps) {
  const location = useLocation();

  return (
    <nav>
      {title && (
        <Text variant="heading-subsection" className="cn-text-foreground-1 mb-4">
          {title}
        </Text>
      )}

      <ul className="space-y-1">
        {sections.map(section => {
          const isActive =
            location.pathname === section.path || location.pathname.startsWith(section.path + '/');

          return (
            <li key={section.id}>
              <Link
                to={section.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'cn-bg-brand-primary cn-text-white'
                      : 'cn-text-foreground-2 hover:cn-bg-background-3'
                  }`}
              >
                {section.icon && (
                  <IconV2
                    name={section.icon as any}
                    size="sm"
                    className={isActive ? 'text-white' : 'cn-text-foreground-3'}
                  />
                )}
                <span>{section.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

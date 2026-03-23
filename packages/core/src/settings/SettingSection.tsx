import { Text } from '@harnessio/ui/components';

export interface SettingSectionProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

/**
 * SettingSection - Wrapper for a group of related settings
 *
 * Provides consistent spacing and styling for settings groups
 */
export function SettingSection({
  children,
  title,
  description,
  className = '',
}: SettingSectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="mb-4">
        <Text variant="heading-subsection" className="cn-text-foreground-1 mb-1">
          {title}
        </Text>
        {description && (
          <Text variant="body-normal" className="cn-text-foreground-3">
            {description}
          </Text>
        )}
      </div>

      <div className="space-y-4 cn-bg-background-2 border cn-border-border-1 rounded-lg p-6">
        {children}
      </div>
    </div>
  );
}

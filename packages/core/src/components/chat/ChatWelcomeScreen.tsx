/**
 * ChatWelcomeScreen - Empty state with quick actions for chat
 */

import { Vertical, Horizontal, Text, Button, Card } from '@harnessio/ui';
import type { ChatWelcomeScreenProps } from './types';

export function ChatWelcomeScreen({
  title = 'Welcome to Chat',
  message = 'Start a conversation by typing a message below or choose a quick action.',
  quickActions = [],
  className = '',
}: ChatWelcomeScreenProps) {
  return (
    <Vertical
      gap="6"
      align="center"
      justify="center"
      className={`flex-1 p-8 ${className}`}
    >
      {/* Welcome message */}
      <Vertical gap="2" align="center" className="max-w-md text-center">
        <Text variant="heading-lg" className="text-cn-text-foreground-1">
          {title}
        </Text>
        <Text variant="body-md" className="text-cn-text-foreground-2">
          {message}
        </Text>
      </Vertical>

      {/* Quick actions */}
      {quickActions.length > 0 && (
        <Vertical gap="3" className="w-full max-w-md">
          <Text variant="label-sm" className="text-cn-text-foreground-2">
            Quick Actions
          </Text>
          <Vertical gap="2">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className="cursor-pointer hover:bg-cn-bg-background-2 transition-colors"
                onClick={action.onClick}
              >
                <Horizontal gap="3" align="center" className="p-3">
                  {action.icon && (
                    <div className="text-cn-brand-primary">
                      {typeof action.icon === 'string' ? (
                        <span>{action.icon}</span>
                      ) : (
                        action.icon
                      )}
                    </div>
                  )}
                  <Text variant="body-md" className="text-cn-text-foreground-1">
                    {action.label}
                  </Text>
                </Horizontal>
              </Card>
            ))}
          </Vertical>
        </Vertical>
      )}
    </Vertical>
  );
}

/**
 * ChatWelcomeScreen - Empty state with quick actions for chat
 */

import type { ChatWelcomeScreenProps } from './types';

export function ChatWelcomeScreen({
  title = 'Welcome to Chat',
  message = 'Start a conversation by typing a message below or choose a quick action.',
  quickActions = [],
  className = '',
}: ChatWelcomeScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center flex-1 gap-6 p-8 ${className}`}>
      {/* Welcome message */}
      <div className="flex flex-col items-center gap-2 max-w-md text-center">
        <span className="text-2xl font-bold text-cn-text-foreground-1">
          {title}
        </span>
        <span className="text-base text-cn-text-foreground-2">
          {message}
        </span>
      </div>

      {/* Quick actions */}
      {quickActions.length > 0 && (
        <div className="flex flex-col gap-3 w-full max-w-md">
          <span className="text-xs font-medium text-cn-text-foreground-2">
            Quick Actions
          </span>
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="border border-cn-border-border-1 rounded-lg cursor-pointer hover:bg-cn-bg-background-2 transition-colors"
                onClick={action.onClick}
              >
                <div className="flex items-center gap-3 p-3">
                  {action.icon && (
                    <div className="text-cn-brand-primary">
                      {typeof action.icon === 'string' ? (
                        <span>{action.icon}</span>
                      ) : (
                        action.icon
                      )}
                    </div>
                  )}
                  <span className="text-base text-cn-text-foreground-1">
                    {action.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

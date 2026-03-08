/**
 * MessageBubble - Individual chat message display component
 */

import { Horizontal, Vertical, Text } from '@harnessio/ui';
import type { MessageBubbleProps } from './types';

export function MessageBubble({
  message,
  showAvatar = true,
  showTimestamp = true,
  className = '',
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  // Format timestamp if present
  const formattedTime = message.timestamp
    ? new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(message.timestamp)
    : null;

  // Get avatar or initials
  const avatarContent = message.avatar || message.userName?.charAt(0).toUpperCase() || '?';

  return (
    <Horizontal
      gap="2"
      align="start"
      className={`
        ${isUser ? 'flex-row-reverse' : ''}
        ${className}
      `}
    >
      {/* Avatar */}
      {showAvatar && !isSystem && (
        <div
          className={`
            flex items-center justify-center
            w-8 h-8 rounded-full
            text-sm font-medium
            ${isUser ? 'bg-cn-brand-primary text-white' : 'bg-cn-bg-background-3 text-cn-text-foreground-1'}
          `}
        >
          {avatarContent}
        </div>
      )}

      {/* Message content */}
      <Vertical gap="1" className={`flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Header: name and timestamp */}
        {(message.userName || showTimestamp) && !isSystem && (
          <Horizontal gap="2" align="center">
            {message.userName && (
              <Text variant="label-sm" className="text-cn-text-foreground-2">
                {message.userName}
              </Text>
            )}
            {showTimestamp && formattedTime && (
              <Text variant="label-xs" className="text-cn-text-foreground-3">
                {formattedTime}
              </Text>
            )}
          </Horizontal>
        )}

        {/* Message bubble */}
        <div
          className={`
            px-3 py-2 rounded-lg
            max-w-[80%]
            ${isSystem ? 'bg-cn-bg-background-2 text-cn-text-foreground-3 text-center w-full italic' : ''}
            ${isUser ? 'bg-cn-brand-primary text-white' : !isSystem ? 'bg-cn-bg-background-2 text-cn-text-foreground-1' : ''}
            ${message.streaming ? 'animate-pulse' : ''}
          `}
        >
          {typeof message.content === 'string' ? (
            <Text
              variant="body-md"
              className={`
                ${isUser ? 'text-white' : isSystem ? 'text-cn-text-foreground-3' : 'text-cn-text-foreground-1'}
              `}
            >
              {message.content}
            </Text>
          ) : (
            message.content
          )}
        </div>
      </Vertical>
    </Horizontal>
  );
}

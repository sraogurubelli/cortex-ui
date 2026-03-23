/**
 * MessageBubble - Individual chat message display component
 */

import type { MessageBubbleProps } from './types';

export function MessageBubble({
  message,
  showAvatar = true,
  showTimestamp = true,
  className = '',
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const formattedTime = message.timestamp
    ? new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(message.timestamp)
    : null;

  const avatarContent = message.avatar || message.userName?.charAt(0).toUpperCase() || '?';

  return (
    <div
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''} ${className}`}
    >
      {showAvatar && !isSystem && (
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            isUser ? 'bg-cn-brand-primary text-white' : 'bg-cn-bg-background-3 text-cn-text-foreground-1'
          }`}
        >
          {avatarContent}
        </div>
      )}

      <div className={`flex flex-col gap-1 flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {(message.userName || showTimestamp) && !isSystem && (
          <div className="flex items-center gap-2">
            {message.userName && (
              <span className="text-xs font-medium text-cn-text-foreground-2">
                {message.userName}
              </span>
            )}
            {showTimestamp && formattedTime && (
              <span className="text-[10px] text-cn-text-foreground-3">
                {formattedTime}
              </span>
            )}
          </div>
        )}

        <div
          className={`px-3 py-2 rounded-lg max-w-[80%] ${
            isSystem ? 'bg-cn-bg-background-2 text-cn-text-foreground-3 text-center w-full italic' : ''
          } ${
            isUser ? 'bg-cn-brand-primary text-white' : !isSystem ? 'bg-cn-bg-background-2 text-cn-text-foreground-1' : ''
          } ${message.streaming ? 'animate-pulse' : ''}`}
        >
          {typeof message.content === 'string' ? (
            <span
              className={
                isUser ? 'text-white' : isSystem ? 'text-cn-text-foreground-3' : 'text-cn-text-foreground-1'
              }
            >
              {message.content}
            </span>
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
}

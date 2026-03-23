/**
 * Chat - Full chat interface with messages and input
 */

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ChatWelcomeScreen } from './ChatWelcomeScreen';
import type { ChatProps } from './types';

export function Chat({
  messages,
  onSendMessage,
  loading = false,
  placeholder = 'Type a message...',
  disabled = false,
  quickActions = [],
  title,
  headerActions,
  className = '',
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      {(title || headerActions) && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-cn-border-border-1">
          {title && (
            <span className="text-lg font-semibold text-cn-text-foreground-1">
              {title}
            </span>
          )}
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <ChatWelcomeScreen
            title={title || 'Welcome to Chat'}
            quickActions={quickActions}
          />
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                showAvatar={true}
                showTimestamp={true}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {loading && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cn-brand-primary rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-cn-brand-primary rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-2 h-2 bg-cn-brand-primary rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-cn-border-border-1">
        <ChatInput
          placeholder={placeholder}
          onSubmit={onSendMessage}
          disabled={disabled || loading}
          autoFocus={true}
        />
      </div>
    </div>
  );
}

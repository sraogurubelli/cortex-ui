/**
 * Chat - Full chat interface with messages and input
 */

import { useEffect, useRef } from 'react';
import { Vertical, Horizontal, Text } from '@harnessio/ui';
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Vertical gap="0" className={`h-full ${className}`}>
      {/* Header */}
      {(title || headerActions) && (
        <Horizontal
          gap="3"
          align="center"
          justify="space-between"
          className="px-4 py-3 border-b border-cn-border-border-1"
        >
          {title && (
            <Text variant="heading-md" className="text-cn-text-foreground-1">
              {title}
            </Text>
          )}
          {headerActions && <div>{headerActions}</div>}
        </Horizontal>
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
          <Vertical gap="4" className="p-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                showAvatar={true}
                showTimestamp={true}
              />
            ))}
            <div ref={messagesEndRef} />
          </Vertical>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="px-4 pb-4">
            <Horizontal gap="2" align="center">
              <div className="w-2 h-2 bg-cn-brand-primary rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-cn-brand-primary rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-2 h-2 bg-cn-brand-primary rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
            </Horizontal>
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
    </Vertical>
  );
}

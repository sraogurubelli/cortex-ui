/**
 * MIT License
 * Copyright (c) 2025 SynterAIQ
 * 
 * MessageBubble Component
 * 
 * Enhanced message bubble component with header support, avatar rendering,
 * and convenience wrappers for user and assistant messages.
 */

import React from 'react';

export interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string | React.ReactNode;
  timestamp?: Date;
  showHeader?: boolean;
  userName?: string;
  avatar?: React.ReactNode;
  backgroundColor?: string;
  className?: string;
  children?: React.ReactNode;
}

const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const renderSystemHeader = () => {
  return (
    <div className="cortex-message-header cortex-message-header-system">
      <div className="cortex-message-avatar cortex-message-avatar-system">AI</div>
      <span className="cortex-message-header-label">Assistant</span>
    </div>
  );
};

const renderUserHeader = (userName: string, initials: string) => {
  return (
    <div className="cortex-message-header cortex-message-header-user">
      <div className="cortex-message-avatar cortex-message-avatar-user">{initials}</div>
      <span className="cortex-message-header-label">{userName || 'User'}</span>
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  role,
  content,
  timestamp,
  showHeader = false,
  userName = '',
  avatar,
  backgroundColor,
  className = '',
  children,
}) => {
  const initials = getInitials(userName);
  const isSystemMessage = role === 'assistant' || role === 'system';
  const isUserMessage = role === 'user';

  const messageClass = isSystemMessage
    ? 'cortex-message-bubble cortex-message-bubble-system'
    : 'cortex-message-bubble cortex-message-bubble-user';

  return (
    <div className={`${messageClass} ${className}`}>
      {showHeader && (
        <>
          {isSystemMessage && renderSystemHeader()}
          {isUserMessage && renderUserHeader(userName, initials)}
        </>
      )}

      <div
        className="cortex-message-bubble-content"
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        {children || (typeof content === 'string' ? <div>{content}</div> : content)}
      </div>

      {timestamp && (
        <div className="cortex-message-bubble-timestamp">
          {timestamp.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export interface AssistantMessageProps extends Omit<MessageBubbleProps, 'role'> {
  isFirstInStream?: boolean;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  isFirstInStream = false,
  showHeader,
  ...props
}) => {
  return <MessageBubble role="assistant" showHeader={isFirstInStream || showHeader} {...props} />;
};

export interface UserMessageProps extends Omit<MessageBubbleProps, 'role'> {}

export const UserMessage: React.FC<UserMessageProps> = (props) => {
  return <MessageBubble role="user" showHeader={true} {...props} />;
};

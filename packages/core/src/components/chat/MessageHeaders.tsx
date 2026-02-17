/**
 * MIT License
 * Copyright (c) 2025 SynterAIQ
 * 
 * MessageHeaders Component
 * 
 * Header components for system and user messages with avatar rendering,
 * timestamp display, and role indicators.
 */

import React from 'react';

export interface MessageHeaderProps {
  role: 'user' | 'assistant' | 'system';
  userName?: string;
  avatar?: React.ReactNode;
  timestamp?: Date;
  showTimestamp?: boolean;
  className?: string;
}

const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const MessageHeader: React.FC<MessageHeaderProps> = ({
  role,
  userName = '',
  avatar,
  timestamp,
  showTimestamp = false,
  className = '',
}) => {
  const isSystemMessage = role === 'assistant' || role === 'system';
  const isUserMessage = role === 'user';

  if (isSystemMessage) {
    return (
      <div className={`cortex-message-header cortex-message-header-system ${className}`}>
        {avatar || <div className="cortex-message-avatar cortex-message-avatar-system">AI</div>}
        <span className="cortex-message-header-label">Assistant</span>
        {showTimestamp && timestamp && (
          <span className="cortex-message-header-timestamp">
            {timestamp.toLocaleTimeString()}
          </span>
        )}
      </div>
    );
  }

  if (isUserMessage) {
    const initials = getInitials(userName);
    return (
      <div className={`cortex-message-header cortex-message-header-user ${className}`}>
        {avatar || (
          <div className="cortex-message-avatar cortex-message-avatar-user">{initials}</div>
        )}
        <span className="cortex-message-header-label">{userName || 'User'}</span>
        {showTimestamp && timestamp && (
          <span className="cortex-message-header-timestamp">
            {timestamp.toLocaleTimeString()}
          </span>
        )}
      </div>
    );
  }

  return null;
};

export interface SystemMessageHeaderProps {
  avatar?: React.ReactNode;
  timestamp?: Date;
  showTimestamp?: boolean;
}

export const SystemMessageHeader: React.FC<SystemMessageHeaderProps> = ({
  avatar,
  timestamp,
  showTimestamp = false,
}) => {
  return (
    <MessageHeader
      role="assistant"
      avatar={avatar}
      timestamp={timestamp}
      showTimestamp={showTimestamp}
    />
  );
};

export interface UserMessageHeaderProps {
  userName?: string;
  avatar?: React.ReactNode;
  timestamp?: Date;
  showTimestamp?: boolean;
}

export const UserMessageHeader: React.FC<UserMessageHeaderProps> = ({
  userName,
  avatar,
  timestamp,
  showTimestamp = false,
}) => {
  return (
    <MessageHeader
      role="user"
      userName={userName}
      avatar={avatar}
      timestamp={timestamp}
      showTimestamp={showTimestamp}
    />
  );
};

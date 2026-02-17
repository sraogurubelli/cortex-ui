/**
 * MIT License
 * Copyright (c) 2025 SynterAIQ
 * 
 * ChatWelcomeScreen Component
 * 
 * Welcome screen displayed when there are no messages, with personalized greeting
 * and quick action buttons.
 */

import React from 'react';

export interface QuickAction {
  id: string;
  label: string;
  icon?: string;
  prompt: string;
}

export interface ChatWelcomeScreenProps {
  userName?: string;
  greeting?: string;
  illustration?: React.ReactNode;
  quickActions?: QuickAction[];
  onQuickAction?: (prompt: string) => void;
  position?: 'fullscreen' | 'sidebar';
  className?: string;
}

const getDisplayName = (name?: string): string => {
  if (!name) return 'User';
  return name.includes('@') ? name.split('@')[0] : name;
};

const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { id: 'help', label: 'Get Help', icon: '❓', prompt: 'How can you help me?' },
  { id: 'explore', label: 'Explore Features', icon: '🔍', prompt: 'What can you do?' },
  { id: 'examples', label: 'See Examples', icon: '📚', prompt: 'Show me examples' },
];

export const ChatWelcomeScreen: React.FC<ChatWelcomeScreenProps> = ({
  userName,
  greeting,
  illustration,
  quickActions = DEFAULT_QUICK_ACTIONS,
  onQuickAction,
  position = 'sidebar',
  className = '',
}) => {
  const displayName = getDisplayName(userName);
  const defaultGreeting = `Welcome back, ${displayName}.`;

  const handleQuickAction = (action: QuickAction) => {
    onQuickAction?.(action.prompt);
  };

  return (
    <div className={`cortex-chat-welcome-screen cortex-chat-welcome-screen-${position} ${className}`}>
      <div className="cortex-chat-welcome-content">
        {illustration && <div className="cortex-chat-welcome-illustration">{illustration}</div>}

        <div className="cortex-chat-welcome-greeting">
          <h2 className="cortex-chat-welcome-title">
            {greeting || defaultGreeting}
          </h2>
          <p className="cortex-chat-welcome-subtitle">How can I help you today?</p>
        </div>

        <div
          className={`cortex-chat-welcome-actions ${
            position === 'fullscreen' ? 'cortex-chat-welcome-actions-row' : 'cortex-chat-welcome-actions-column'
          }`}
        >
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="cortex-chat-welcome-action-button"
              onClick={() => handleQuickAction(action)}
            >
              {action.icon && <span className="cortex-chat-welcome-action-icon">{action.icon}</span>}
              <span className="cortex-chat-welcome-action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

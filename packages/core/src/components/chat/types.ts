/**
 * Type definitions for chat components
 */

import type { ReactNode } from 'react';

export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: 'user' | 'assistant' | 'system';
  /** Message content (can be text or JSX) */
  content: string | ReactNode;
  /** When the message was sent */
  timestamp?: Date;
  /** Display name of the user */
  userName?: string;
  /** Avatar URL or initials */
  avatar?: string;
  /** Whether the message is still being generated/streamed */
  streaming?: boolean;
}

export interface QuickAction {
  /** Unique identifier for the action */
  id: string;
  /** Display label */
  label: string;
  /** Icon name or component */
  icon?: string | ReactNode;
  /** Action to perform when clicked */
  onClick: () => void;
}

export interface ChatThread {
  /** Unique identifier for the thread */
  id: string;
  /** Thread title/name */
  title: string;
  /** Last message preview */
  preview?: string;
  /** Last activity timestamp */
  lastActivity?: Date;
  /** Number of unread messages */
  unreadCount?: number;
}

export interface ChatInputProps {
  /** Placeholder text */
  placeholder?: string;
  /** Current input value (controlled) */
  value?: string;
  /** onChange handler (controlled) */
  onChange?: (value: string) => void;
  /** onSubmit handler */
  onSubmit: (message: string) => void;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether to show send button */
  showSendButton?: boolean;
  /** Whether input should auto-focus */
  autoFocus?: boolean;
  /** Maximum height for auto-resize */
  maxHeight?: number;
}

export interface MessageBubbleProps {
  /** The message to display */
  message: ChatMessage;
  /** Whether to show avatar */
  showAvatar?: boolean;
  /** Whether to show timestamp */
  showTimestamp?: boolean;
  /** Custom className */
  className?: string;
}

export interface ChatProps {
  /** Array of messages to display */
  messages: ChatMessage[];
  /** Callback when user sends a message */
  onSendMessage: (message: string) => void;
  /** Whether chat is loading */
  loading?: boolean;
  /** Input placeholder text */
  placeholder?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Quick actions to show in welcome screen */
  quickActions?: QuickAction[];
  /** Title for the chat */
  title?: string;
  /** Custom header actions */
  headerActions?: ReactNode;
  /** Custom className */
  className?: string;
}

export interface ChatPanelProps {
  /** Thread history */
  threads: ChatThread[];
  /** Currently active thread ID */
  activeThreadId?: string;
  /** Callback when thread is selected */
  onSelectThread: (threadId: string) => void;
  /** Callback when thread is deleted */
  onDeleteThread?: (threadId: string) => void;
  /** Callback to create new thread */
  onNewThread?: () => void;
  /** Whether panel is collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * UI action event emitted by the agent to instruct the frontend
 * to navigate, open a document, trigger search, etc.
 */
export interface UIActionEvent {
  action_id: string;
  action_type: string;
  args: Record<string, unknown>;
  status: 'executing' | 'waiting_for_user' | 'completed' | 'failed';
  display_text?: string;
}

/**
 * Callback invoked when the agent sends a ui_action SSE event.
 * The host application should implement this to handle navigation,
 * document opening, search, etc.
 */
export type UIActionHandler = (action: UIActionEvent) => void;

export interface ChatWelcomeScreenProps {
  /** Welcome title */
  title?: string;
  /** Welcome message */
  message?: string;
  /** Quick action buttons */
  quickActions?: QuickAction[];
  /** Custom className */
  className?: string;
}

export interface ChatHistoryProps {
  /** Thread history */
  threads: ChatThread[];
  /** Currently active thread ID */
  activeThreadId?: string;
  /** Callback when thread is selected */
  onSelectThread: (threadId: string) => void;
  /** Callback when thread is deleted */
  onDeleteThread?: (threadId: string) => void;
  /** Search query */
  searchQuery?: string;
  /** onSearch handler */
  onSearch?: (query: string) => void;
  /** Custom className */
  className?: string;
}

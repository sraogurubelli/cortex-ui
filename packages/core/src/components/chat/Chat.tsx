/**
 * MIT License
 * Copyright (c) 2025 SynterAIQ
 * 
 * Chat Component
 * 
 * Main chat orchestrator component with message list rendering, scroll management,
 * auto-scroll to bottom, scroll-to-bottom button, and error boundaries.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { ChatWelcomeScreen } from './ChatWelcomeScreen';
import { MessageBubble } from './MessageBubble';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string | React.ReactNode;
  timestamp?: Date;
  userName?: string;
}

export interface ChatProps {
  messages?: ChatMessage[];
  threadTitle?: string;
  showTypingAnimation?: boolean;
  onSendMessage?: (message: string) => void;
  onToggleHistory?: () => void;
  onOpenSettings?: () => void;
  onStartNewThread?: () => void;
  showHistory?: boolean;
  showWelcomeScreen?: boolean;
  welcomeScreenProps?: React.ComponentProps<typeof ChatWelcomeScreen>;
  inputPlaceholder?: string;
  inputDisabled?: boolean;
  inputLoading?: boolean;
  renderMessage?: (message: ChatMessage) => React.ReactNode;
  renderContent?: (content: string | React.ReactNode, message: ChatMessage) => React.ReactNode;
  className?: string;
}

const SCROLL_THRESHOLD_PX = 100;

export const Chat: React.FC<ChatProps> = ({
  messages = [],
  threadTitle,
  showTypingAnimation = false,
  onSendMessage,
  onToggleHistory,
  onOpenSettings,
  onStartNewThread,
  showHistory = false,
  showWelcomeScreen = false,
  welcomeScreenProps,
  inputPlaceholder,
  inputDisabled = false,
  inputLoading = false,
  renderMessage,
  renderContent,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isNearBottom = distanceFromBottom < SCROLL_THRESHOLD_PX;
      setShowScrollButton(!isNearBottom);
    },
    []
  );

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleSend = useCallback(
    (value: string) => {
      if (!value.trim() || inputLoading) return;
      setInputValue('');
      onSendMessage?.(value);
    },
    [onSendMessage, inputLoading]
  );

  const defaultRenderMessage = (message: ChatMessage) => {
    return (
      <MessageBubble
        key={message.id}
        role={message.role}
        content={
          renderContent ? renderContent(message.content, message) : message.content
        }
        timestamp={message.timestamp}
        userName={message.userName}
        showHeader={message.role === 'user' || (message.role === 'assistant' && messages.indexOf(message) === 0)}
      />
    );
  };

  const hasMessages = messages.length > 0;
  const showEmptyState = !hasMessages && !showWelcomeScreen;

  return (
    <div className={`cortex-chat ${className}`}>
      {(onToggleHistory || onOpenSettings || onStartNewThread || threadTitle) && (
        <ChatHeader
          title={threadTitle}
          showTypingAnimation={showTypingAnimation}
          onToggleHistory={onToggleHistory}
          onOpenSettings={onOpenSettings}
          onStartNewThread={onStartNewThread}
          showHistory={showHistory}
        />
      )}

      {showHistory ? (
        <div className="cortex-chat-history-container">
          {/* History will be rendered by parent */}
        </div>
      ) : (
        <>
          <div className="cortex-chat-messages-container" ref={scrollRef} onScroll={handleScroll}>
            {showWelcomeScreen && !hasMessages ? (
              <ChatWelcomeScreen {...welcomeScreenProps} />
            ) : showEmptyState ? (
              <div className="cortex-chat-empty">No messages yet</div>
            ) : (
              messages.map((message) =>
                renderMessage ? renderMessage(message) : defaultRenderMessage(message)
              )
            )}
          </div>

          {showScrollButton && (
            <button
              type="button"
              onClick={scrollToBottom}
              className="cortex-chat-scroll-to-bottom"
              title="Scroll to bottom"
            >
              ↓
            </button>
          )}

          <div className="cortex-chat-input-wrapper">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSend}
              placeholder={inputPlaceholder}
              disabled={inputDisabled}
              loading={inputLoading}
            />
          </div>
        </>
      )}
    </div>
  );
};

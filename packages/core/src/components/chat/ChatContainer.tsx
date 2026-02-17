/**
 * MIT License
 * Copyright (c) 2025 SynterAIQ
 * 
 * ChatContainer Component
 * 
 * A container wrapper component that orchestrates chat UI with message list and input.
 */

import React from 'react';
import { ChatInput } from './ChatInput';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatContainerProps {
  initialMessages?: Message[];
  messages?: Message[];
  onSendMessage?: (message: string) => Promise<void> | void;
  onMessageReceived?: (message: Message) => void;
  inputPlaceholder?: string;
  inputDisabled?: boolean;
  inputLoading?: boolean;
  className?: string;
  renderMessage?: (message: Message) => React.ReactNode;
  renderInput?: (props: {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    loading: boolean;
  }) => React.ReactNode;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  initialMessages = [],
  messages: controlledMessages,
  onSendMessage,
  onMessageReceived,
  inputPlaceholder,
  inputDisabled = false,
  inputLoading = false,
  className = '',
  renderMessage,
  renderInput,
}) => {
  const [internalMessages, setInternalMessages] = React.useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  const messages = controlledMessages ?? internalMessages;
  const isLoading = inputLoading || isSending;

  const handleSend = async (value: string) => {
    if (!value.trim() || isLoading) return;

    setInputValue('');
    setIsSending(true);

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: value,
      timestamp: new Date(),
    };

    if (!controlledMessages) {
      setInternalMessages((prev) => [...prev, userMessage]);
    }

    try {
      if (onSendMessage) {
        await onSendMessage(value);
      }

      // If onMessageReceived is provided, it will be called by the parent
      // Otherwise, we could add an assistant message here
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const defaultRenderMessage = (message: Message) => {
    return (
      <div
        key={message.id}
        className={`cortex-chat-message cortex-chat-message-${message.role}`}
      >
        <div className="cortex-chat-message-content">{message.content}</div>
        {message.timestamp && (
          <div className="cortex-chat-message-timestamp">
            {message.timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`cortex-chat-container ${className}`}>
      <div className="cortex-chat-messages">
        {messages.length === 0 ? (
          <div className="cortex-chat-empty">No messages yet</div>
        ) : (
          messages.map((message) =>
            renderMessage ? renderMessage(message) : defaultRenderMessage(message)
          )
        )}
      </div>

      <div className="cortex-chat-input-container">
        {renderInput ? (
          renderInput({
            value: inputValue,
            onChange: setInputValue,
            onSubmit: handleSend,
            loading: isLoading,
          })
        ) : (
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSend}
            placeholder={inputPlaceholder}
            disabled={inputDisabled}
            loading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

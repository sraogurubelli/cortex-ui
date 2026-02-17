/**
 * MIT License
 * Copyright (c) 2025 SynterAIQ
 * 
 * ChatInput Component
 * 
 * A chat input component with auto-resizing textarea, keyboard handling,
 * and optional footer actions (mode chips, etc.).
 */

import React, { useRef, useEffect, useCallback, KeyboardEvent, ChangeEvent } from 'react';

export interface ChatInputMode {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
}

export interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  modes?: ChatInputMode[];
  onModeToggle?: (modeId: string) => void;
  footerActions?: React.ReactNode;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
}

const DEFAULT_MIN_HEIGHT = 26;
const DEFAULT_MAX_HEIGHT = 140;

export const ChatInput: React.FC<ChatInputProps> = ({
  value = '',
  onChange,
  onSubmit,
  onCancel,
  placeholder = 'Type a message...',
  disabled = false,
  loading = false,
  modes = [],
  onModeToggle,
  footerActions,
  className = '',
  minHeight = DEFAULT_MIN_HEIGHT,
  maxHeight = DEFAULT_MAX_HEIGHT,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;

    if (scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
    } else if (scrollHeight < minHeight) {
      textarea.style.height = `${minHeight}px`;
      textarea.style.overflowY = 'hidden';
    } else {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    }
  }, [minHeight, maxHeight]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
      adjustTextareaHeight();
    },
    [onChange, adjustTextareaHeight]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          // Allow newline with Shift+Enter
          return;
        }
        // Submit on Enter (without Shift)
        e.preventDefault();
        if (value.trim() && onSubmit) {
          onSubmit(value.trim());
        }
      }
    },
    [value, onSubmit]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (loading && onCancel) {
        onCancel();
      } else if (value.trim() && onSubmit) {
        onSubmit(value.trim());
      }
    },
    [value, loading, onSubmit, onCancel]
  );

  const showFooter = modes.length > 0 || footerActions;

  return (
    <form onSubmit={handleSubmit} className={`cortex-chat-input ${className}`}>
      <div className="cortex-chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || loading}
          className="cortex-chat-input-textarea"
          rows={1}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
          }}
        />
      </div>

      {showFooter && (
        <div className="cortex-chat-input-footer">
          <div className="cortex-chat-input-footer-left">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => onModeToggle?.(mode.id)}
                className={`cortex-chat-input-mode-chip ${mode.active ? 'active' : ''}`}
                disabled={disabled}
              >
                {mode.icon && <span className="cortex-chat-input-mode-icon">{mode.icon}</span>}
                <span>{mode.label}</span>
              </button>
            ))}
            {footerActions}
          </div>
          <button
            type="submit"
            className="cortex-chat-input-submit"
            disabled={disabled || (!value.trim() && !loading)}
          >
            {loading ? '⏹' : '↑'}
          </button>
        </div>
      )}

      {!showFooter && (
        <button
          type="submit"
          className="cortex-chat-input-submit-standalone"
          disabled={disabled || (!value.trim() && !loading)}
        >
          {loading ? '⏹' : '↑'}
        </button>
      )}
    </form>
  );
};

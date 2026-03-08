/**
 * ChatInput - Auto-resizing text input with keyboard shortcuts
 */

import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { Horizontal, Button } from '@harnessio/ui';
import type { ChatInputProps } from './types';

export function ChatInput({
  placeholder = 'Type a message...',
  value: controlledValue,
  onChange,
  onSubmit,
  disabled = false,
  showSendButton = true,
  autoFocus = false,
  maxHeight = 200,
}: ChatInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto';

    // Set new height based on content, up to maxHeight
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value, maxHeight]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      if (onChange) {
        onChange('');
      } else {
        setInternalValue('');
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Horizontal gap="2" align="end" className="w-full">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={`
            w-full px-3 py-2
            bg-cn-bg-background-2
            border border-cn-border-border-1
            rounded-lg
            text-cn-text-foreground-1
            placeholder:text-cn-text-foreground-3
            focus:outline-none focus:ring-2 focus:ring-cn-brand-primary
            resize-none
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          style={{
            minHeight: '40px',
            maxHeight: `${maxHeight}px`,
          }}
        />
      </div>

      {showSendButton && (
        <Button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="h-10"
        >
          Send
        </Button>
      )}
    </Horizontal>
  );
}

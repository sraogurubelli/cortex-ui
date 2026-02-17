/**
 * MIT License
 * Copyright (c) 2025 SynterAIQ
 * 
 * ChatHeader Component
 * 
 * Header component for chat interface with title display, history toggle,
 * settings drawer trigger, and new thread button.
 */

import React from 'react';

export interface ChatHeaderProps {
  title?: string;
  showTypingAnimation?: boolean;
  typingSpeed?: number;
  onToggleHistory?: () => void;
  onOpenSettings?: () => void;
  onStartNewThread?: () => void;
  showHistory?: boolean;
  position?: 'left' | 'right' | 'fullscreen';
  onPositionChange?: (position: 'left' | 'right' | 'fullscreen') => void;
  className?: string;
}

interface TypingAnimationProps {
  text: string;
  speed?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setDisplayedText(text);
    }
  }, [currentIndex, text, speed]);

  React.useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return <span>{displayedText}</span>;
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  showTypingAnimation = false,
  typingSpeed = 50,
  onToggleHistory,
  onOpenSettings,
  onStartNewThread,
  showHistory = false,
  position,
  onPositionChange,
  className = '',
}) => {
  const getPositionIcon = (): string => {
    switch (position) {
      case 'right':
        return '→';
      case 'fullscreen':
        return '⛶';
      default:
        return '←';
    }
  };

  const handlePositionChange = (newPosition: 'left' | 'right' | 'fullscreen') => {
    onPositionChange?.(newPosition);
  };

  const renderTitle = () => {
    if (showHistory) {
      return (
        <div className="cortex-chat-header-title-with-back">
          <button
            type="button"
            onClick={onToggleHistory}
            className="cortex-chat-header-back-button"
          >
            ←
          </button>
          <span className="cortex-chat-header-title">History</span>
        </div>
      );
    }

    if (position === 'fullscreen') {
      return <div />; // No title for fullscreen
    }

    if (title) {
      return (
        <div className="cortex-chat-header-title">
          {showTypingAnimation ? (
            <TypingAnimation text={title} speed={typingSpeed} />
          ) : (
            title
          )}
        </div>
      );
    }

    return <div className="cortex-chat-header-title">New Chat</div>;
  };

  return (
    <div className={`cortex-chat-header ${className}`}>
      <div className="cortex-chat-header-left">{renderTitle()}</div>
      <div className="cortex-chat-header-right">
        {onStartNewThread && (
          <button
            type="button"
            onClick={onStartNewThread}
            className="cortex-chat-header-button"
            title="New Thread"
          >
            +
          </button>
        )}

        {position && position !== 'fullscreen' && onPositionChange && (
          <div className="cortex-chat-header-position-menu">
            <button
              type="button"
              className="cortex-chat-header-button"
              title="Change Position"
            >
              {getPositionIcon()}
            </button>
            <div className="cortex-chat-header-position-dropdown">
              <button
                type="button"
                onClick={() => handlePositionChange('left')}
                className={position === 'left' ? 'active' : ''}
              >
                ← Left
              </button>
              <button
                type="button"
                onClick={() => handlePositionChange('right')}
                className={position === 'right' ? 'active' : ''}
              >
                → Right
              </button>
            </div>
          </div>
        )}

        <div className="cortex-chat-header-actions-menu">
          <button type="button" className="cortex-chat-header-button" title="More">
            ⋯
          </button>
          <div className="cortex-chat-header-actions-dropdown">
            {onToggleHistory && (
              <button type="button" onClick={onToggleHistory}>
                🕐 History
              </button>
            )}
            {onOpenSettings && (
              <button type="button" onClick={onOpenSettings}>
                ⚙️ Settings
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

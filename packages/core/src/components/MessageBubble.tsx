import React from 'react';

export interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp?: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  role,
  timestamp,
}) => {
  return (
    <div
      className="cortex-message-bubble"
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        backgroundColor: role === 'user' ? '#3b82f6' : '#f3f4f6',
        color: role === 'user' ? 'white' : 'black',
        maxWidth: '70%',
        alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
      }}
    >
      <div>{content}</div>
      {timestamp && (
        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
          {timestamp.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

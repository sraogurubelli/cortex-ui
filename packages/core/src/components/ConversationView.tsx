import React from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ConversationViewProps {
  messages: Message[];
  onMessageSend?: (content: string) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  onMessageSend,
}) => {
  return (
    <div className="cortex-conversation-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: message.role === 'user' ? '#f3f4f6' : '#e0e7ff',
            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '70%',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            {message.role}
          </div>
          <div>{message.content}</div>
        </div>
      ))}
    </div>
  );
};

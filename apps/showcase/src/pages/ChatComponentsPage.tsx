import { useState } from 'react';
import {
  Chat,
  ChatPanel,
  type ChatMessage,
  type QuickAction,
} from '@cortex/core';
import './ChatComponentsPage.css';

export default function ChatComponentsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const handleSend = (text: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `You said: "${text}". This is a demo response showing how the chat component works.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const quickActions: QuickAction[] = [
    { id: 'hello', label: 'Say Hello', prompt: 'Hello!' },
    { id: 'help', label: 'Get Help', prompt: 'How can you help me?' },
    { id: 'demo', label: 'Demo Message', prompt: 'This is a demo message' },
  ];

  return (
    <div className="chat-components-page">
      <div className="page-header">
        <h1>Chat Components</h1>
        <p>
          Interactive showcase of chat UI components including Chat, ChatPanel,
          ChatInput, MessageBubble, and more.
        </p>
      </div>

      <div className="chat-demo-container">
        <div className="chat-demo-controls">
          <label>
            <input
              type="checkbox"
              checked={collapsed}
              onChange={(e) => setCollapsed(e.target.checked)}
            />
            Collapse Panel
          </label>
          <button onClick={() => setMessages([])}>Clear Messages</button>
        </div>

        <div className="chat-demo-wrapper">
          <ChatPanel
            position="right"
            collapsed={collapsed}
            onCollapseChange={setCollapsed}
          >
            <Chat
              messages={messages}
              onSendMessage={handleSend}
              showWelcomeScreen={messages.length === 0}
              welcomeScreenProps={{
                userName: 'Demo User',
                quickActions,
              }}
              inputPlaceholder="Type a message..."
            />
          </ChatPanel>
        </div>
      </div>

      <div className="component-info">
        <h2>Components Showcased</h2>
        <div className="component-list">
          <div className="component-item">
            <h3>Chat</h3>
            <p>Main orchestrator component with scroll management, auto-scroll to bottom, and error boundaries.</p>
          </div>
          <div className="component-item">
            <h3>ChatPanel</h3>
            <p>Collapsible sidebar panel with position management (left/right/fullscreen) and smooth transitions.</p>
          </div>
          <div className="component-item">
            <h3>ChatWelcomeScreen</h3>
            <p>Welcome screen component with personalized greeting, illustration, and quick action buttons.</p>
          </div>
          <div className="component-item">
            <h3>ChatInput</h3>
            <p>Auto-resizing textarea with keyboard handling (Enter to send, Shift+Enter for newline).</p>
          </div>
          <div className="component-item">
            <h3>MessageBubble</h3>
            <p>Message display component with headers, avatar/initials rendering, and role-based styling.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

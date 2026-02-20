import { useState } from 'react';
import { Chat, ChatPanel, type ChatMessage, type QuickAction } from '@cortex/core';
import { Layout, Text, Button } from '@harnessio/ui/components';
import './ConversationsPage.css';

export default function ConversationsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
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
        content: `You said: "${text}". This is a simulated response. In a real application, this would connect to your AI agent's API.`,
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

  /** Chat pillar: @cortex/core Chat + ChatPanel. */
  return (
    <Layout.Vertical gapY="lg" className="w-full">
      <Layout.Vertical gapY="sm">
        <Text variant="heading-large" color="foreground-1">
          Hi
        </Text>
        <Text variant="body-normal" color="foreground-3">
          Conversations — chat (@cortex/core)
        </Text>
      </Layout.Vertical>

      <Layout.Vertical gapY="md">
        <Layout.Horizontal gapX="sm" align="center" className="p-cn-md bg-cn-1 rounded-cn-2 border border-cn-border-1">
          <label className="flex items-center gap-cn-sm cursor-pointer">
            <input
              type="checkbox"
              checked={collapsed}
              onChange={(e) => setCollapsed(e.target.checked)}
              className="w-4 h-4"
            />
            <Text variant="body-normal" color="foreground-2">
              Collapse Panel
            </Text>
          </label>
          <Button variant="secondary" size="sm" onClick={() => setMessages([])}>
            Clear Messages
          </Button>
        </Layout.Horizontal>

        <div className="h-[600px] border border-cn-border-1 rounded-cn-2 overflow-hidden bg-cn-1">
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
              inputPlaceholder="Type a message to your agent..."
            />
          </ChatPanel>
        </div>
      </Layout.Vertical>
    </Layout.Vertical>
  );
}

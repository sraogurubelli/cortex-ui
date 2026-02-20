import { useState, useEffect } from 'react';
import { Chat, type ChatMessage, type QuickAction } from '@cortex/core';
import { useChatContext } from '../contexts/chat-context';

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'hello', label: 'Say Hello', prompt: 'Hello!' },
  { id: 'help', label: 'How can you help?', prompt: 'How can you help me today?' },
  { id: 'ideas', label: 'Give me ideas', prompt: 'Give me 3 ideas for a small project' },
];

export default function ChatPage() {
  const { newChatKey } = useChatContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setMessages([]);
  }, [newChatKey]);

  const handleSend = (text: string) => {
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: `You said: "${text}". This is a simple agentic hello world — connect me to your agent API for real responses.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-cn-0">
      <Chat
        messages={messages}
        onSendMessage={handleSend}
        showWelcomeScreen={messages.length === 0}
        welcomeScreenProps={{
          userName: 'You',
          greeting: 'Hello! Start a conversation.',
          quickActions: QUICK_ACTIONS,
        }}
        inputPlaceholder="Message Hello World Agentic..."
        className="flex-1 flex flex-col min-h-0"
      />
    </div>
  );
}

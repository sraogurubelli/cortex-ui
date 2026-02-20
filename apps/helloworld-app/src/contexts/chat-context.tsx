import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ChatContextValue {
  newChatKey: number;
  startNewChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [newChatKey, setNewChatKey] = useState(0);
  const startNewChat = useCallback(() => setNewChatKey((k) => k + 1), []);
  return (
    <ChatContext.Provider value={{ newChatKey, startNewChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}

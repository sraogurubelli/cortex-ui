# Chat Components

A comprehensive set of chat UI components for building AI/agentic chat interfaces.

## Components

### ChatInput

Auto-resizing textarea input with keyboard handling and optional mode chips.

```tsx
import { ChatInput } from '@cortex/core';

<ChatInput
  value={inputValue}
  onChange={setInputValue}
  onSubmit={handleSend}
  placeholder="Type a message..."
  loading={isLoading}
/>
```

### ChatContainer

Container wrapper that orchestrates chat UI with message list and input.

```tsx
import { ChatContainer } from '@cortex/core';

<ChatContainer
  messages={messages}
  onSendMessage={handleSend}
  inputPlaceholder="Type a message..."
/>
```

### ChatHeader

Header component with title display, history toggle, settings, and new thread buttons.

```tsx
import { ChatHeader } from '@cortex/core';

<ChatHeader
  title="My Chat"
  onToggleHistory={handleToggleHistory}
  onOpenSettings={handleOpenSettings}
  onStartNewThread={handleNewThread}
/>
```

### ChatHistory

Searchable list of conversation threads with infinite scroll.

```tsx
import { ChatHistory } from '@cortex/core';

<ChatHistory
  threads={threads}
  currentThreadId={currentThreadId}
  onSelectThread={handleSelectThread}
  onSearch={handleSearch}
  onLoadMore={handleLoadMore}
/>
```

### ChatWelcomeScreen

Welcome screen with personalized greeting and quick action buttons.

```tsx
import { ChatWelcomeScreen } from '@cortex/core';

<ChatWelcomeScreen
  userName="John Doe"
  quickActions={[
    { id: 'help', label: 'Get Help', prompt: 'How can you help me?' }
  ]}
  onQuickAction={handleQuickAction}
/>
```

### ChatPanel

Collapsible sidebar panel with position management.

```tsx
import { ChatPanel } from '@cortex/core';

<ChatPanel
  position="right"
  collapsed={collapsed}
  onCollapseChange={setCollapsed}
>
  <Chat />
</ChatPanel>
```

### Chat

Main chat orchestrator component with scroll management and error boundaries.

```tsx
import { Chat } from '@cortex/core';

<Chat
  messages={messages}
  threadTitle="My Conversation"
  onSendMessage={handleSend}
  showWelcomeScreen={messages.length === 0}
/>
```

### MessageBubble

Enhanced message bubble with header support and convenience wrappers.

```tsx
import { MessageBubble, AssistantMessage, UserMessage } from '@cortex/core';

<MessageBubble
  role="user"
  content="Hello!"
  userName="John"
  showHeader={true}
/>

<AssistantMessage content="Hi there!" isFirstInStream={true} />
<UserMessage content="Hello!" userName="John" />
```

### MessageHeaders

Header components for system and user messages.

```tsx
import { SystemMessageHeader, UserMessageHeader } from '@cortex/core';

<SystemMessageHeader />
<UserMessageHeader userName="John Doe" />
```

## Usage Example

```tsx
import {
  Chat,
  ChatPanel,
  ChatWelcomeScreen,
  QuickAction,
} from '@cortex/core';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const handleSend = (text: string) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }]);
  };

  const quickActions: QuickAction[] = [
    { id: 'help', label: 'Get Help', prompt: 'Help me' },
  ];

  return (
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
          userName="User",
          quickActions,
        }}
      />
    </ChatPanel>
  );
}
```

## License

MIT License - Copyright (c) 2025 SynterAIQ

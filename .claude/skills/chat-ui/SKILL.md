---
name: chat-ui
description: Use when building chat UIs in cortex-ui — @cortex/core chat components (Chat, ChatInput, ChatPanel, MessageBubble, ChatWelcomeScreen, ChatHistory). For WebChatUI Chat pillar.
---

# Chat UI (Cortex UI – @cortex/core)

Use this skill when implementing the **Chat** pillar of the WebChatUI framework. All chat primitives live in **`@cortex/core`**.

## Package and Exports

- **Package**: `@cortex/core` (cortex-ui/packages/core).
- **Entry**: `packages/core/src/index.ts` and `packages/core/src/components/chat/index.ts`.

## Main Components

| Component | Use |
|-----------|-----|
| **Chat** | Full chat: messages area, optional welcome screen, input, scroll-to-bottom. Props: `messages`, `onSendMessage`, `showWelcomeScreen`, `welcomeScreenProps`, `inputPlaceholder`, etc. |
| **ChatInput** | Single input: auto-resize, Enter to send, Shift+Enter newline. |
| **ChatPanel** | Collapsible side panel (left/right/fullscreen) wrapping chat or history. |
| **ChatHeader** | Optional header (title, history/settings/new-thread buttons). |
| **ChatWelcomeScreen** | Empty state: greeting, optional illustration, quick-action chips. |
| **ChatHistory** | List of threads with search and infinite scroll. |
| **MessageBubble** | One message (user/assistant/system); optional header and timestamp. |
| **MessageHeaders** | System/user message headers (avatar, label, timestamp). |
| **ChatContainer** | Simpler container: message list + input (no welcome/history). |

## Message Shape

```ts
interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string | React.ReactNode
  timestamp?: Date
  userName?: string
}
```

## Typical Usage

- **Single chat view**: `<Chat messages={messages} onSendMessage={handleSend} showWelcomeScreen={!messages.length} welcomeScreenProps={{ userName, quickActions }} inputPlaceholder="…" />`
- **Chat in a panel**: Wrap `<Chat … />` in `<ChatPanel position="right" collapsed={collapsed} onCollapseChange={setCollapsed}>`.
- **Full-height layout**: Parent uses flex; Chat root gets `className="flex-1 flex flex-col min-h-0"` and CSS so `.cortex-chat-messages-container` is `flex: 1; min-height: 0; overflow: auto`.

## Quick Actions (Welcome Screen)

```ts
interface QuickAction {
  id: string
  label: string
  icon?: string
  prompt: string
}
```

Pass to `welcomeScreenProps.quickActions`; clicking sends `prompt` (e.g. via `onSendMessage` or `onQuickAction`).

## Reference

- **WebChatUI**: Chat is one of the four pillars (see `webchatui-framework` skill).
- **Docs**: `packages/core/src/components/chat/README.md`.
- **App example**: `apps/helloworld-app` Conversations page and `apps/showcase` chat pages.

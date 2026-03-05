# Cortex UI Sample App

A complete sample application demonstrating how to build a full-featured app using Cortex UI components, similar to ai-evaluation-ui.

## Overview

This sample app showcases:

- **Feature-based Architecture** - Organized by features (agents, evaluations, conversations)
- **Real Application Structure** - Complete app with routing, data fetching, and state management
- **Cortex UI Components** - Uses components from `@cortex/core` in real scenarios
- **TanStack Query** - For data fetching and caching
- **React Router** - For navigation between pages
- **Mock API** - Simulated API calls for demonstration

## Features

### Agents
- List view with agent cards
- Detail view with metrics and scores
- Status indicators
- Uses `AgentCard` and `AgentAvatar` components

### Evaluations
- List view with evaluation cards
- Detail view with score breakdowns
- Status tracking
- Uses `EvaluationBadge` and `ScoreDisplay` components

### Conversations
- Interactive chat interface
- Message history
- Welcome screen with quick actions
- Uses `Chat`, `ChatPanel`, and related chat components

## Getting Started

### Prerequisites

- Node.js >= 18.20.4
- pnpm >= 9.0.0

### Installation

From the cortex-ui root directory:

```bash
pnpm install
```

### Development

```bash
# From cortex-ui root
pnpm dev

# Or from this directory
cd apps/sample-app
pnpm dev
```

The app will be available at `http://localhost:5175`

### Building

```bash
pnpm build
```

## Project Structure

```
src/
├── features/              # Feature-based organization
│   ├── agents/           # Agents feature
│   │   ├── components/   # AgentCard, AgentsList
│   │   ├── hooks/        # useAgents, useAgent
│   │   ├── api/          # agentsApi (mock)
│   │   └── types.ts      # Agent interface
│   ├── evaluations/      # Evaluations feature
│   └── conversations/    # Conversations feature
├── components/
│   └── layout/           # Layout component
├── pages/                 # Page components
│   ├── AgentsPage.tsx
│   ├── AgentDetailPage.tsx
│   ├── EvaluationsPage.tsx
│   ├── EvaluationDetailPage.tsx
│   └── ConversationsPage.tsx
├── App.tsx                # Main app with routing
└── main.tsx               # Entry point
```

## Usage Examples

### Using Agent Components

```tsx
import { AgentCard } from '@cortex/core';

<AgentCard
  name="Research Agent"
  description="Conducts deep research"
  status="active"
/>
```

### Using Evaluation Components

```tsx
import { EvaluationBadge, ScoreDisplay } from '@cortex/core';

<EvaluationBadge
  score={0.92}
  maxScore={1}
  variant="success"
/>
```

### Using Chat Components

```tsx
import { Chat, ChatPanel } from '@cortex/core';

<ChatPanel position="right">
  <Chat
    messages={messages}
    onSendMessage={handleSend}
  />
</ChatPanel>
```

## License

MIT License - see [../../LICENSE](../../LICENSE) for details.

# @cortex/core

Core UI components for AI/agentic applications.

## Installation

```bash
pnpm add @cortex/core
```

## Components

### Agent Components

- **AgentCard** - Display agent information in a card format
- **AgentAvatar** - Avatar component for agents

### Evaluation Components

- **EvaluationBadge** - Badge displaying evaluation scores
- **ScoreDisplay** - Display multiple scores

### Conversation Components

- **ConversationView** - View for displaying conversations
- **MessageBubble** - Individual message bubble component

## Usage

```tsx
import { AgentCard, EvaluationBadge, ConversationView } from '@cortex/core';

function App() {
  return (
    <div>
      <AgentCard
        name="My Agent"
        description="An AI agent"
        status="active"
      />
      <EvaluationBadge score={0.85} maxScore={1} label="Accuracy" />
    </div>
  );
}
```

## Dependencies

- `@cortex/design-system` - Base design system components
- React 18+

## License

MIT License - see [../../LICENSE](../../LICENSE) for details.

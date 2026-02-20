# Cortex UI

Cortex UI is a monorepo containing design system and core UI components for building AI/agentic applications.

## Structure

```
cortex-ui/
├── packages/
│   ├── core/              # Core AI/agentic UI components
│   └── design-system/    # Design system (forked from Harness Canary)
└── apps/                 # Example apps or storybook (optional)
```

## Packages

### `@cortex/core`

Core UI components specifically designed for AI/agentic applications:
- Agent cards and displays
- Conversation views
- Evaluation displays
- Domain-specific UI primitives for agentic workflows

### `@cortex/design-system`

Base design system forked from [Harness Canary](https://github.com/harness/canary):
- Design tokens and themes
- Foundational UI components (buttons, forms, layouts, etc.)
- Maintained with upstream sync from canary

## Getting Started

### Prerequisites

- Node.js >= 18.20.4
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install
pnpm deps
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:core
pnpm build:design-system
```

### Development

```bash
# Start dev servers for all packages and apps
pnpm dev

# Start specific package
cd packages/core && pnpm dev

# Start showcase app
cd apps/showcase && pnpm dev

# Start Hello World app
cd apps/helloworld-app && pnpm dev
```

## Apps

### Showcase App

The `apps/showcase` directory contains a comprehensive showcase application demonstrating all UI components from `@cortex/core`. It includes:

- **Chat Components** - Complete chat UI with panels, inputs, and message bubbles
- **Agent Components** - Agent cards and avatars for displaying AI agents
- **Evaluation Components** - Badges and displays for evaluation scores and metrics
- **Multi-page Navigation** - Browse different component categories with interactive examples

See [apps/showcase/README.md](./apps/showcase/README.md) for details.

### Hello World App

The `apps/helloworld-app` directory contains a complete sample application with a **Monitoring across the entire AI lifecycle** landing page (Continuous Evals and three phases: Pre-production, Runtime inference, Always-on production evals), similar to ai-evaluation-ui:

- **Lifecycle landing page** - Central "Continuous Evals" diagram and phase cards
- **Feature-based architecture** - Agents, evaluations, conversations
- **TanStack Query & React Router** - Data fetching and navigation
- **Cortex UI & Harness UI** - Full app using design system and core components

See [apps/helloworld-app/README.md](./apps/helloworld-app/README.md) for details.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Acknowledgments

- Design system is forked from [Harness Canary](https://github.com/harness/canary) (Apache 2.0)
- We maintain upstream sync to receive updates and security patches

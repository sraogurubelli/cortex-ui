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
# Start dev servers for all packages
pnpm dev

# Start specific package
cd packages/core && pnpm dev
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Acknowledgments

- Design system is forked from [Harness Canary](https://github.com/harness/canary) (Apache 2.0)
- We maintain upstream sync to receive updates and security patches

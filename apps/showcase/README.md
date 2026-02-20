# Cortex UI Showcase

A comprehensive showcase application demonstrating all UI components from `@cortex/core` and `@cortex/design-system`.

## Overview

This showcase app provides interactive examples and documentation for all Cortex UI components:

- **Chat Components** - Complete chat UI with panels, inputs, and message bubbles
- **Agent Components** - Agent cards and avatars for displaying AI agents
- **Evaluation Components** - Badges and displays for evaluation scores and metrics
- **Design System Components** - Base UI components (coming soon)

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
cd apps/showcase
pnpm dev
```

The app will be available at `http://localhost:5174`

### Building

```bash
pnpm build
```

## Features

- **Multi-page Navigation** - Browse different component categories
- **Interactive Examples** - Live, interactive component demonstrations
- **Component Documentation** - Props, usage examples, and best practices
- **Responsive Design** - Works on desktop and mobile devices

## Pages

- **Home** - Overview of all available components
- **Chat Components** - Chat UI components showcase
- **Agent Components** - Agent display components
- **Evaluation Components** - Evaluation and scoring components

## Project Structure

```
apps/showcase/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout with navigation
│   ├── pages/
│   │   ├── HomePage.tsx        # Home/dashboard page
│   │   ├── ChatComponentsPage.tsx
│   │   ├── AgentComponentsPage.tsx
│   │   └── EvaluationComponentsPage.tsx
│   ├── App.tsx                 # Main app with routing
│   └── main.tsx                # Entry point
```

## License

MIT License - see [../../LICENSE](../../LICENSE) for details.

# Hello World App

Reference app that follows the **WebChatUI framework** (Left Nav, Chat, List, Dashboards). Use it as a template for building cortex-ui apps.

## WebChatUI pillars

| Pillar | In this app |
|--------|----------------|
| **Left Nav** | Sidebar with scope selector, nav (Dashboard, Agents, Evaluations, Conversations), usage footer |
| **Chat** | Conversations page — `@cortex/core` Chat, ChatPanel, welcome screen, quick actions |
| **List** | Agents and Evaluations pages — card grids with mock data |
| **Dashboards** | Dashboard (Home) — stat cards + short “WebChatUI framework” overview |

## Overview

- **Dashboard** (`/`): Hi, stat cards (Agents, Evaluations, Conversations), and a short framework overview.
- **Agents** (`/agents`): List view (card grid); detail at `/agents/:id`.
- **Evaluations** (`/evaluations`): List view (card grid); detail at `/evaluations/:id`.
- **Conversations** (`/conversations`): Chat UI with collapse panel, clear messages, and simulated replies.

No API calls; all data is from mock modules under `src/features/*/data/`.

## Stack

- **Design system**: `@harnessio/ui` (Layout, Text, Button, Sidebar, Progress, etc.)
- **Chat**: `@cortex/core` (Chat, ChatInput, ChatPanel, MessageBubble, etc.)
- **Theme**: Dark (`dark-std-std`) via theme context
- **Routing**: React Router; layout in AppShell with Outlet

## Getting started

From cortex-ui root:

```bash
pnpm install
cd apps/helloworld-app
pnpm dev
```

Open **http://localhost:5175**.

## Project structure

```
src/
├── components/
│   ├── layout/          # AppShell, SidebarNav
│   ├── scope-selector/  # Scope selector (org/project)
│   └── PageErrorBoundary.tsx
├── contexts/            # theme-context
├── features/
│   ├── agents/          # types, data (mock), components (AgentsList, AgentCard)
│   └── evaluations/    # types, data (mock), components (EvaluationsList, EvaluationCard)
├── pages/
│   ├── HomePage.tsx     # Dashboard (stat cards + overview)
│   ├── AgentsPage.tsx, AgentDetailPage.tsx
│   ├── EvaluationsPage.tsx, EvaluationDetailPage.tsx
│   └── ConversationsPage.tsx  # Chat
├── App.tsx
└── main.tsx
```

## Skills

See cortex-ui `.claude/skills/` for: **webchatui-framework**, **design-system-basics**, **left-nav-sidebar**, **chat-ui**, **list-and-dashboards**, **ui-guidelines**.

## License

MIT — see [../../LICENSE](../../LICENSE).

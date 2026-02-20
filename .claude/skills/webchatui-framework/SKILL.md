---
name: webchatui-framework
description: Cortex UI is the framework for building a simple WebChatUI. Use when planning or building apps that need Left Nav, Chat, List, or Dashboards. References @cortex/core and design system patterns.
---

# WebChatUI Framework (Cortex UI)

Cortex UI is the framework for a **simple WebChatUI** with four pillars. Use this skill when scoping features or deciding where components live.

## Four Pillars

| Pillar | Purpose | Where it lives |
|--------|---------|----------------|
| **Left Nav** | App shell, sidebar, navigation, scope selector | Design system (`Sidebar`) + app layout; patterns in `left-nav-sidebar` skill |
| **Chat** | Conversations, message list, input, panels | `@cortex/core` – Chat, ChatInput, ChatPanel, MessageBubble, ChatWelcomeScreen, etc. |
| **List** | Lists of items, card grids, tables | Design system (`DataTable`, `Card`, `Layout`) + app features; patterns in `list-and-dashboards` skill |
| **Dashboards** | Summary cards, metrics, overview screens | Design system tokens + simple cards; patterns in `list-and-dashboards` skill |

## Where to Implement

- **`@cortex/core`** (cortex-ui/packages/core): Chat UI, agent/evaluation display primitives, and any shared WebChatUI building blocks (e.g. shell composition, stat cards) that multiple apps will reuse.
- **Design system** (e.g. `@harnessio/ui` or local preset): Buttons, Text, Layout, Sidebar, DataTable, Dialog, tokens. Use via `design-system-basics` skill.
- **Apps** (e.g. helloworld-app, showcase): Compose core + design system into full screens (sidebar + chat, sidebar + list, dashboard layout).

## Bringing platformUI Functionality into Core

When porting patterns from platformUI to cortex-ui:

1. **Left Nav** – Use design system `Sidebar` in the app; core can export a reusable **Shell** or **AppShell** component that composes `Sidebar` + main area + optional scope selector for WebChatUI.
2. **Chat** – Already in core (chat components). Extend with thread list, history, or tool panels as needed.
3. **List** – Prefer design system `DataTable` and `Card` in apps; core can add **CardGrid**, **ListLayout**, or **EmptyState** for consistent list/dashboard layouts.
4. **Dashboards** – Core can add **StatCard** / **MetricCard** and a **DashboardGrid** layout; avoid business logic (keep data fetching in apps).

## Related Skills

- **design-system-basics** – Tokens, Layout, Text, Button, imports.
- **left-nav-sidebar** – Sidebar structure, nav items, collapse, rail.
- **chat-ui** – @cortex/core chat components and usage.
- **list-and-dashboards** – List pages, card grids, tables, dashboard cards.
- **ui-guidelines** – Generic component verification and do/don’t examples.

## Quick Reference

- Chat components: `packages/core/src/components/chat/` and `packages/core/src/index.ts`.
- Design system: use components from the project’s design system package (e.g. `@harnessio/ui/components`) with `cn-` tokens.
- Apps: `apps/helloworld-app` and `apps/showcase` are reference implementations.

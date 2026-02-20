---
name: list-and-dashboards
description: Use when building list views or dashboards in cortex-ui — card grids, DataTable, summary/stat cards, empty states. For WebChatUI List and Dashboards pillars.
---

# List and Dashboards (Cortex UI)

Use this skill when implementing the **List** and **Dashboards** pillars of the WebChatUI framework.

## List Pillar

- **Card grids**: Use design system `Card` (or `Card.Root` / `Card.Body` if that’s the API) inside a grid layout. Example: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-cn-md` with a card per item.
- **Tables**: Use the design system **DataTable** (or Table component) from the design system package for tabular data; avoid raw HTML tables.
- **Layout**: Use **Layout.Vertical** for page structure (title + description + list), then a grid or table for the list.
- **Empty state**: Use **Layout.Vertical** + **Text** for “No items” or “No results”; optionally add a CTA button.
- **Loading**: Use design system **Spinner** or **Skeleton** if available; otherwise a simple “Loading…” text with Layout/Text.

Keep list data and fetching in the app; core can later add shared **CardGrid**, **ListLayout**, or **EmptyState** for consistency.

## Dashboards Pillar

- **Summary / stat cards**: Simple cards with a label, value, and optional description. Use design system **Layout**, **Text**, and tokens (e.g. `p-cn-lg rounded-cn-2 border border-cn-border-1 bg-cn-1`).
- **Layout**: Grid of stat cards (e.g. `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-cn-md`) plus optional sections below (e.g. “Recent activity”).
- **Metrics**: Prefer design system **Progress** or **Text** for numeric metrics; avoid inventing new chart components unless needed.
- **Core**: Can add **StatCard** or **MetricCard** in `@cortex/core` as presentational components (label, value, optional icon/trend); keep data and API in the app.

## Design Tokens

- Use `cn-` tokens for spacing, borders, backgrounds (see **design-system-basics** skill).
- Keep cards and grids responsive (e.g. 1 col mobile, 2–3 cols tablet, 3–4 cols desktop).

## Reference

- **WebChatUI**: List and Dashboards are two of the four pillars (see `webchatui-framework` skill).
- **Apps**: `apps/helloworld-app` Agents and Evaluations pages (card grids); dashboard patterns can mirror simple stat cards + grid.

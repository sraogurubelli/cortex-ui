---
name: design-system-basics
description: Use when using design system components and tokens in cortex-ui — Layout (Vertical/Horizontal/Flex), Text, Button, design tokens (cn- prefix), and generic verification steps. Stays product-agnostic.
---

# Design System Basics (Cortex UI)

Use this skill when writing UI that uses the project’s design system (e.g. `@harnessio/ui/components`). Keep examples generic so they work across cortex-ui apps.

## Core Components

| Need | Component | Typical import |
|------|-----------|----------------|
| Button | `Button` | design system `components` |
| Text / headings | `Text` | design system `components` |
| Icons | `IconV2` | design system `components` |
| Row layout | `Layout.Horizontal` | design system `components` |
| Column layout | `Layout.Vertical` | design system `components` |
| Flex layout | `Layout.Flex` | design system `components` |

## Layout Props (Generic)

- Prefer **gap** props the design system supports (e.g. `gap`, `gapX`, `gapY` with token sizes: `xs`, `sm`, `md`, `lg`).
- Use **align** and **justify** when available (e.g. `align="center"`, `justify="between"`).
- Do not assume prop names; check the component source or types in the design system package.

```tsx
// Example (verify exact prop names in your design system)
<Layout.Vertical gapY="md">
  <Layout.Horizontal gapX="sm" align="center" justify="between">
    <Text variant="heading-section">Title</Text>
    <Button variant="primary">Action</Button>
  </Layout.Horizontal>
</Layout.Vertical>
```

## Design Tokens (cn- prefix)

Use the design system’s Tailwind tokens (often `cn-` prefix). Verify names in the project’s Tailwind preset or config.

| Need | Example pattern | Example class |
|------|------------------|---------------|
| Background | `bg-cn-{0-3}`, `bg-cn-background-*` | `bg-cn-1`, `bg-cn-background-hover` |
| Text color | `text-cn-foreground-{1-3}` | `text-cn-foreground-1` |
| Border | `border-cn-border-{1-3}` | `border-cn-border-1` |
| Spacing | `p-cn-*`, `gap-cn-*` | `p-cn-md`, `gap-cn-md` |
| Radius | `rounded-cn-*` | `rounded-cn-2` |

## Common Mistakes

- **Text**: Use `variant` (e.g. `body-strong`, `heading-section`), not a non-existent `weight` prop.
- **Icons**: Use the `color` prop when supported instead of `className` for color.
- **Layout**: Use the design system’s gap/align API (e.g. `gapX="sm"`, `gapY="md"`), not arbitrary values.

## Verification

Before using a component:

1. Resolve the design system package (e.g. from `package.json` or workspace).
2. Check component source or types for valid props and variants.
3. Use only documented variants and token names from the project’s Tailwind config.

For detailed do/don’t examples and tables, see the **ui-guidelines** skill.

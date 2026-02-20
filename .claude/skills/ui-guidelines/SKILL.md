---
name: ui-guidelines
description: Use when creating or modifying UI that uses the design system — expert guidance on components (e.g. from @harnessio/ui/components), design tokens (cn- prefix), Layout/Text/Button/Sidebar APIs, and Tailwind design-system standards. Keeps examples and references generic for reuse across projects.
---

# UI Guidelines Skill

You are an expert on the design system components used by this project. Answer based on the component package (e.g. `@harnessio/ui/components`), its source when available, and the design system Tailwind config (e.g. `tailwind-design-system.ts` or preset).

## Optional: Project Configuration

Some projects use a config file to point at the design system source.

- **Location**: Repository root (same directory as `package.json`)
- **Filename**: e.g. `.ui-builder-config.json` (or similar)

**If present**, it may define:

- `uiComponentsSourcePath` — path to design system components (for reading source)
- `tailwindConfigPath` — path to design system Tailwind config
- Optional reference app path for patterns

**If the file does not exist**, use the installed package (e.g. `node_modules/@harnessio/ui`) and the project’s own Tailwind preset. Do not assume absolute paths; use workspace-relative or package-relative paths.

## Critical Rules

1. **Use only components from the design system package** (e.g. `@harnessio/ui/components`) — avoid one-off custom primitives when a design system component exists.
2. **Use the designated table component** (e.g. `DataTable`) from the design system for tables.
3. **Follow patterns** from the design system docs or the project’s reference app (e.g. sidebar, list pages, tables).
4. **Use design tokens** via Tailwind classes with the design system prefix (e.g. `cn-`).
5. **Do not hardcode** colors, spacing, or typography; use tokens.
6. **Verify icon names** against the design system’s icon type (e.g. `IconV2NamesType`) or icon map.
7. **Check component props** in the component source or types before using.
8. **Use only design system icons**; no arbitrary icon libraries unless the project explicitly allows them.

## Component Verification (Recommended)

When using a component:

1. **Read the component source or types** (from the config path or `node_modules/<package>/...`).
2. **Find variant/option definitions** (e.g. `cva()` or similar) to get valid prop values.
3. **Use only documented variants and values**; do not guess.
4. **For icons**, use only names from the design system’s icon map or exported type.

## Common Mistakes (Avoid)

### Text

```tsx
// ❌ WRONG — no weight prop
<Text truncate weight="semibold">Title</Text>

// ✅ CORRECT — use variant
<Text variant="body-strong">Title</Text>
```

### Status / badge theme

```tsx
// ❌ WRONG — 'default' may not be a valid theme
const theme = status === 'Success' ? 'success' : 'default'

// ✅ CORRECT — use a valid fallback (e.g. 'muted')
const theme = status === 'Success' ? 'success' : 'muted'
<StatusBadge theme={theme} variant="status">{status}</StatusBadge>
```

### Icons

```tsx
// ❌ WRONG — avoid using className for icon color when a color prop exists
<IconV2 name="check" className="text-cn-success-primary" />

// ✅ CORRECT — use color prop when supported
<IconV2 name="check" color="success" />
```

### Layout (flex)

```tsx
// ❌ WRONG — invalid gap prop (e.g. "large" if only size tokens exist)
<Layout.Horizontal gap="large">

// ✅ CORRECT — use design system gap values (e.g. gapX, gapY with token sizes)
<Layout.Horizontal gapX="sm" align="center">
<Layout.Vertical gapY="md">
```

## Component Lookup (Generic)

| Need           | Component           | Typical import                    |
|----------------|--------------------|-----------------------------------|
| Button         | `Button`           | design system `components`        |
| Text/headings  | `Text`             | design system `components`        |
| Icons          | `IconV2` (or equiv) | design system `components`      |
| Flex layout    | `Layout.Flex`      | design system `components`        |
| Row            | `Layout.Horizontal`| design system `components`        |
| Column         | `Layout.Vertical`  | design system `components`        |
| Table          | `DataTable`        | design system `components`        |
| Dropdown       | `DropdownMenu`     | design system `components`        |
| Dialog/Modal   | `Dialog`           | design system `components`        |
| Sidebar        | `Sidebar`          | design system `components`        |
| Progress       | `Progress`         | design system `components`        |
| Toast          | `toast` (or equiv) | design system `components`       |
| Search         | `SearchInput`      | design system `components` (not a raw `Input` when a dedicated search component exists) |

*Package name (e.g. `@harnessio/ui/components`) is project-specific.*

## Design Token Lookup (Generic)

| Need            | Token pattern (example)     | Example class              |
|-----------------|-----------------------------|----------------------------|
| Background      | `bg-cn-{0–3}` or `bg-cn-background-*` | `bg-cn-background-hover`   |
| Text color      | `text-cn-foreground-{1–3}`  | `text-cn-foreground-1`     |
| Brand           | `text-cn-brand`, `bg-cn-brand` | `text-cn-brand`          |
| Border          | `border-cn-border-{1–3}`    | `border-cn-border-1`       |
| Spacing (gap)   | `gap-cn-{xs,sm,md,lg,xl}`    | `gap-cn-md`                |
| Padding         | `p-cn-{xs,sm,md,lg,xl}`     | `p-cn-md`                  |
| Radius          | `rounded-cn-{1–4}`           | `rounded-cn-2`             |

*Exact token names depend on the design system; use the project’s Tailwind preset or design tokens docs.*

## Reference Patterns

When implementing features:

- Prefer **sidebar + main content** patterns from the design system or the project’s reference app.
- For **lists**, use the same layout and table/list components as in existing list pages.
- For **tables**, use the design system table component and column patterns.
- For **icons**, use only names from the design system’s icon map or type.

Reference paths (e.g. to a specific repo’s pipelines or canary UI) are project-specific; use the paths that exist in the current workspace or docs.

## Summary

Code should:

1. Use only the design system’s components (and the correct package for the project).
2. Use only verified component props and variant values.
3. Use only valid icon names from the design system.
4. Use design tokens (e.g. `cn-` prefix) for color, spacing, and radius.
5. Follow the project’s or design system’s reference patterns.
6. Be type-safe (no type errors).

Type safety is required, not optional.

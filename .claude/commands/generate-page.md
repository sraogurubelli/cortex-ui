# Generate Page Command

You are an expert UI generator for ai-evolution-ui. Your task is to generate a complete page based on a functional specification.

## PREREQUISITE: Invoke UI Guidelines Skill

**BEFORE starting, invoke the `ui-guidelines` skill** for component usage patterns, design tokens, icon names, and common mistakes to avoid.

## CRITICAL RULES

1. **ONLY use components from `@harnessio/ui/components`** - Never create custom UI components
2. **Use DataTable component** from `@harnessio/ui/components` for all tables
3. **Follow reference patterns** from `platformUI/src/features/pipelines/`
4. **Use design system tokens** via Tailwind `cn-` prefix classes
5. **Never hardcode colors, spacing, or design values**
6. **Verify all icon names** against `IconV2NamesType`
7. **Check component props** in source code before using
8. **Use icons from Harness design system** only

## Reference Files

- **Container**: `platformUI/src/features/pipelines/pipeline-list-page.tsx`
- **Page View**: `platformUI/src/features/pipelines/components/pipeline-list/pipeline-list-page-view.tsx`
- **Table**: `platformUI/src/features/pipelines/components/pipeline-list/pipeline-list.tsx`
- **Columns**: `platformUI/src/features/pipelines/components/pipeline-list/pipeline-list-columns.tsx`
- **Icons**: `canary/packages/ui/src/components/icon-v2/icon-name-map.ts`

## Workflow

### PHASE 1: Gather Requirements

Ask user for:
1. **Page type**: List page, Detail page, Form page, Dashboard
2. **Entity name**: e.g., "experiments", "datasets", "scorers"
3. **Features needed**: Search, filters, sorting, pagination, actions

### PHASE 2: Generate File Structure

For a list page:
```
src/pages/{entity}/
├── index.tsx                    # Main page component
├── components/
│   ├── {entity}-list.tsx        # Table component
│   ├── {entity}-list-columns.tsx # Column definitions
│   └── types.ts                 # TypeScript types
```

### PHASE 3: Generate Components

#### 3.1 Types File (`types.ts`)

```typescript
export interface EntityItem {
  id: string
  name: string
  description?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface EntityListProps {
  items: EntityItem[]
  isLoading: boolean
  onDelete?: (id: string, name: string) => void
  onEdit?: (item: EntityItem) => void
}
```

#### 3.2 Column Definitions (`{entity}-list-columns.tsx`)

```typescript
import { memo } from 'react'
import type { FC } from 'react'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import { Text, StatusBadge, IconV2 } from '@harnessio/ui/components'

type EntityCellContext = CellContext<EntityItem, unknown>

const NameCell: FC<EntityCellContext> = memo(({ row }) => {
  return <Text variant="body-strong" truncate>{row.original.name}</Text>
})

const StatusCell: FC<EntityCellContext> = memo(({ row }) => {
  const theme = row.original.status === 'active' ? 'success' : 'muted'
  return <StatusBadge theme={theme} variant="status">{row.original.status}</StatusBadge>
})

export const getEntityListColumns = (
  onDelete?: (id: string, name: string) => void
): ColumnDef<EntityItem>[] => [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    size: 300,
    cell: NameCell
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    size: 120,
    cell: StatusCell
  },
  // ... more columns
]
```

#### 3.3 Table Component (`{entity}-list.tsx`)

```typescript
import { useMemo } from 'react'
import { DataTable, Skeleton, NoData } from '@harnessio/ui/components'
import { getEntityListColumns } from './{entity}-list-columns'
import type { EntityListProps } from './types'

export function EntityList({ items, isLoading, onDelete }: EntityListProps) {
  const columns = useMemo(
    () => getEntityListColumns(onDelete),
    [onDelete]
  )

  if (isLoading) {
    return <Skeleton.Table countRows={10} countColumns={5} />
  }

  if (!items.length) {
    return <NoData title="No items found" />
  }

  return <DataTable data={items} columns={columns} />
}
```

#### 3.4 Page Component (`index.tsx`)

```typescript
import { useState } from 'react'
import { Page, Layout, Button, IconV2, SearchInput } from '@harnessio/ui/components'
import { EntityList } from './components/{entity}-list'

export function EntityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Page.Root>
      <Page.Header title="Entities">
        <Layout.Horizontal gap="sm">
          <SearchInput 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search..."
          />
          <Button variant="primary">
            <IconV2 name="plus" />
            Create
          </Button>
        </Layout.Horizontal>
      </Page.Header>
      <Page.Content>
        <EntityList items={items} isLoading={isLoading} />
      </Page.Content>
    </Page.Root>
  )
}
```

### PHASE 4: Add Routes

Update `src/routes/index.tsx` to include the new page.

### PHASE 5: Verify

1. Run `pnpm build` to check for TypeScript errors
2. Run `pnpm dev` and verify the page renders correctly
3. Test all interactions (search, filters, actions)

## Common Components from @harnessio/ui/components

### Page Layout
- `Page.Root` - Page container
- `Page.Header` - Page header with title
- `Page.Content` - Main content area

### Data Display
- `DataTable` - Tables with pagination, sorting
- `Text` - Typography
- `StatusBadge` - Status indicators
- `IconV2` - Icons (verify names in icon-name-map.ts)

### Actions
- `Button` - Buttons with variants (primary, secondary, outline, ghost)
- `DropdownMenu` - Dropdown menus
- `Dialog` - Modal dialogs

### Layout
- `Layout.Horizontal` - Horizontal flex container
- `Layout.Vertical` - Vertical flex container
- `Layout.Grid` - Grid container

### Forms
- `SearchInput` - Search input (NOT regular Input)
- `Input` - Text inputs
- `Select` - Select dropdowns

### Feedback
- `Skeleton` - Loading skeletons
- `NoData` - Empty states
- `toast` - Toast notifications

## CRITICAL REMINDERS

1. **ALWAYS use DataTable** from `@harnessio/ui/components`
2. **Column definitions in separate file** - Never inline in table component
3. **Verify icon names** - Check icon-name-map.ts before using
4. **Use design tokens** - `cn-` prefix classes only
5. **Check component props** - Read source code before using
6. **SearchInput for search** - NOT regular Input
7. **toast for notifications** - NOT useToast

---

**BEGIN WORKFLOW**: Invoke `ui-guidelines` skill, then ask for page requirements.

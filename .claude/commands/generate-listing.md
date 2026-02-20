# Generate Listing Screen Command

You are an expert UI generator for ai-evolution-ui. Your task is to generate a complete listing screen based on a functional specification.

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

## Reference Files

- **Container Pattern**: `platformUI/src/features/pipelines/pipeline-list-page.tsx`
- **Page View Pattern**: `platformUI/src/features/pipelines/components/pipeline-list/pipeline-list-page-view.tsx`
- **Table Pattern**: `platformUI/src/features/pipelines/components/pipeline-list/pipeline-list.tsx`
- **Columns Pattern**: `platformUI/src/features/pipelines/components/pipeline-list/pipeline-list-columns.tsx`
- **Icons**: `canary/packages/ui/src/components/icon-v2/icon-name-map.ts`

## Workflow

### PHASE 1: Gather Inputs

Ask user for:
1. **Entity Name** (required) - e.g., "experiments", "datasets", "scorers"
2. **Columns** (required) - Which columns to display
3. **Actions** (optional) - Row actions (edit, delete, view, run)
4. **Filters** (optional) - Filtering capabilities

### PHASE 2: Generate File Structure

```
src/features/{entity}/
├── index.tsx                           # Page component with API logic
├── components/
│   └── {entity}-list/
│       ├── {entity}-list-columns.tsx   # Column definitions (SEPARATE FILE)
│       ├── {entity}-list.tsx           # Table with DataTable
│       ├── filter-options.tsx          # Filter configs
│       └── types.ts                    # Component types
└── types.ts                            # Entity types
```

### PHASE 3: Generate Code Components

#### 3.1 Entity Types (`types.ts`)

```typescript
export interface EntityItem {
  id: string
  name: string
  description?: string
  status?: string
  createdAt?: string
  updatedAt?: string
  // ... entity-specific fields
}
```

#### 3.2 Column Definitions (`{entity}-list-columns.tsx`)

**CRITICAL**: Column definitions MUST be in separate file. NO inline JSX in cell property.

```typescript
import { memo } from 'react'
import type { FC } from 'react'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import { Text, StatusBadge, IconV2 } from '@harnessio/ui/components'
import type { EntityItem } from '../../types'

type EntityCellContext = CellContext<EntityItem, unknown>

// Simple cell components - use memo for performance
const NameCell: FC<EntityCellContext> = memo(({ row }) => {
  return (
    <Text variant="body-strong" truncate>
      {row.original.name}
    </Text>
  )
})
NameCell.displayName = 'NameCell'

const StatusCell: FC<EntityCellContext> = memo(({ row }) => {
  const status = row.original.status
  const theme = status === 'completed' ? 'success' : status === 'failed' ? 'danger' : 'muted'
  return <StatusBadge theme={theme} variant="status">{status}</StatusBadge>
})
StatusCell.displayName = 'StatusCell'

// Factory function for cells needing dependencies
const createActionsCell = (
  onDelete: (id: string, name: string) => void,
  onEdit: (item: EntityItem) => void
): FC<EntityCellContext> => {
  const ActionsCell: FC<EntityCellContext> = memo(({ row }) => (
    <div className="flex justify-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost" iconOnly>
            <IconV2 name="more-horizontal" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => onEdit(row.original)}>
            <IconV2 name="edit-pencil" size="sm" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onDelete(row.original.id, row.original.name)}>
            <IconV2 name="trash" size="sm" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  ))
  ActionsCell.displayName = 'ActionsCell'
  return ActionsCell
}

// Export column definitions function
export const getEntityListColumns = (
  onDelete: (id: string, name: string) => void,
  onEdit: (item: EntityItem) => void
): ColumnDef<EntityItem>[] => [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    size: 1000,
    minSize: 200,
    maxSize: Number.MAX_SAFE_INTEGER,
    enableSorting: true,
    cell: NameCell
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    size: 120,
    minSize: 100,
    maxSize: 150,
    cell: StatusCell
  },
  {
    id: 'actions',
    header: '',
    size: 64,
    minSize: 64,
    maxSize: 64,
    enableHiding: false,
    cell: createActionsCell(onDelete, onEdit)
  }
]
```

**Key Rules**:
- **Simple cells**: Create as separate memo components with displayName
- **Complex cells**: Use factory functions returning memo components
- **NO inline JSX**: `cell: ({ row }) => <div>...</div>` is FORBIDDEN
- **Large cells (>20 lines)**: Extract to separate file

#### 3.3 Table Component (`{entity}-list.tsx`)

```typescript
import { useMemo } from 'react'
import { DataTable, Skeleton, NoData } from '@harnessio/ui/components'
import { getEntityListColumns } from './{entity}-list-columns'
import type { EntityListProps } from './types'

export function EntityList({
  items,
  isLoading,
  paginationProps,
  currentSorting,
  onSortingChange,
  onDelete,
  onEdit,
  onRowClick
}: EntityListProps) {
  const columns = useMemo(
    () => getEntityListColumns(onDelete, onEdit),
    [onDelete, onEdit]
  )

  if (isLoading) {
    return <Skeleton.Table countRows={10} countColumns={5} />
  }

  if (!items.length) {
    return <NoData title="No items found" />
  }

  return (
    <DataTable
      data={items}
      columns={columns}
      paginationProps={paginationProps}
      currentSorting={currentSorting}
      onSortingChange={onSortingChange}
      onRowClick={onRowClick}
    />
  )
}
```

#### 3.4 Page Component (`index.tsx`)

```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Page,
  Layout,
  Button,
  IconV2,
  SearchInput,
  DeleteAlertDialog
} from '@harnessio/ui/components'
import { EntityList } from './components/{entity}-list/{entity}-list'
import type { EntityItem } from './types'

export function EntityListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteItem, setDeleteItem] = useState<{ id: string; name: string } | null>(null)
  
  // Mock data - replace with API call
  const [items, setItems] = useState<EntityItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = (id: string, name: string) => {
    setDeleteItem({ id, name })
  }

  const handleDeleteConfirm = () => {
    if (!deleteItem) return
    // Call delete API
    setItems(items.filter(item => item.id !== deleteItem.id))
    setDeleteItem(null)
  }

  const handleEdit = (item: EntityItem) => {
    navigate(`/entities/${item.id}/edit`)
  }

  return (
    <>
      <Page.Root>
        <Page.Header title="Entities">
          <Layout.Horizontal gap="sm">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search..."
            />
            <Button variant="primary" onClick={() => navigate('/entities/create')}>
              <IconV2 name="plus" />
              Create
            </Button>
          </Layout.Horizontal>
        </Page.Header>
        <Page.Content>
          <EntityList
            items={items}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Page.Content>
      </Page.Root>

      {deleteItem && (
        <DeleteAlertDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onDelete={handleDeleteConfirm}
          title={`Delete ${deleteItem.name}?`}
          contentText="Are you sure? This action cannot be undone."
          deleteButtonLabel="Delete"
        />
      )}
    </>
  )
}
```

## Column Sizing Standards

| Column Type | size | minSize | maxSize |
|-------------|------|---------|---------|
| Primary (Name) | 1000 | 200 | MAX_SAFE_INTEGER |
| Standard content | 150-250 | 100-150 | 300-500 |
| Date/time | 180 | 180 | 180 |
| Status badge | 120 | 100 | 150 |
| Actions (icon-only) | 64 | 64 | 64 |

## Components Reference

### From `@harnessio/ui/components`

| Component | Use Case |
|-----------|----------|
| `DataTable` | All tables (Tanstack Table v8) |
| `Page.Root/Header/Content` | Page layout |
| `SearchInput` | Search (has 300ms debounce built-in) |
| `DeleteAlertDialog` | Delete confirmation |
| `NoData` | Empty states |
| `Skeleton.Table` | Loading states |
| `StatusBadge` | Status indicators |
| `TimeAgoCard` | Date display |
| `Text` | Typography |
| `IconV2` | Icons |
| `Button` | Buttons |
| `DropdownMenu` | Dropdown menus |
| `Layout.Horizontal/Vertical` | Layouts |

### Common Icon Names

- `plus` - Create/Add
- `trash` - Delete
- `edit-pencil` - Edit
- `more-horizontal` - More actions
- `search` - Search
- `check` - Success/Checkmark
- `xmark` - Close/Error
- `clock` - Time/History
- `play` - Run/Start
- `stop` - Stop

## CRITICAL REMINDERS

1. **Column definitions in SEPARATE file** - Never inline
2. **Use memo** for cell components
3. **NO inline JSX** in cell property
4. **SearchInput** for search - NOT Input (has built-in debounce)
5. **DeleteAlertDialog** for ALL deletes
6. **Default page size: 25**
7. **Design tokens** - use `cn-` prefix classes
8. **Verify icon names** - check icon-name-map.ts

---

**BEGIN WORKFLOW**: Ask for entity name and columns to generate.

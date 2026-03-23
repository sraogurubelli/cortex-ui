# Phase 4 Week 2 Complete: Component Library Expansion

## Summary

Successfully expanded the forms component library with four new input types and integrated key Canary UI components. This infrastructure provides essential building blocks for the upcoming Evals feature enhancement and establishes reusable patterns for all future features.

## ✅ Completed Work

### 1. New Input Components Created

**Location:** `/packages/platform/src/forms/inputs/`

All components follow the established pattern: extend `InputComponent` from `@harnessio/forms`, use Canary UI components, include error handling and ARIA accessibility.

---

#### [NumberInput.tsx](packages/platform/src/forms/inputs/NumberInput.tsx)
**Purpose:** Numeric input with increment/decrement controls

**Features:**
- Canary UI Input with `type="number"`
- Increment/decrement buttons (▲/▼)
- Min/max constraints
- Step support (configurable increment value)
- Optional controls (can hide buttons)
- Built-in validation feedback

**InputConfig Options:**
```typescript
{
  min?: number;           // Minimum value
  max?: number;           // Maximum value
  step?: number;          // Increment/decrement step (default: 1)
  placeholder?: string;   // Placeholder text
  showControls?: boolean; // Show ▲▼ buttons (default: true)
}
```

**Usage Example:**
```typescript
{
  inputType: 'number',
  path: 'port',
  label: 'Port',
  inputConfig: {
    min: 1,
    max: 65535,
    step: 1,
    showControls: true
  },
  validation: {
    schema: z.coerce.number().min(1).max(65535)
  }
}
```

**Key Features:**
- Buttons disabled when at min/max limits
- Handles empty and negative values
- Preserves focus on input when using buttons
- Responsive layout (input + controls)

---

#### [CheckboxInput.tsx](packages/platform/src/forms/inputs/CheckboxInput.tsx)
**Purpose:** Checkbox fields (single or group)

**Features:**
- Canary UI Checkbox component
- Single checkbox mode (boolean value)
- Checkbox group mode (string[] value)
- Label integration with click-to-toggle
- Accessible keyboard navigation

**InputConfig Options:**
```typescript
{
  options?: Array<{     // For checkbox group
    label: string;
    value: string;
  }>;
}
```

**Usage Example (Single):**
```typescript
{
  inputType: 'checkbox',
  path: 'acceptTerms',
  label: 'I accept the terms and conditions',
  validation: {
    schema: z.boolean().refine(val => val === true, 'You must accept terms')
  }
}
```

**Usage Example (Group):**
```typescript
{
  inputType: 'checkbox',
  path: 'features',
  label: 'Select Features',
  inputConfig: {
    options: [
      { label: 'Email Notifications', value: 'email' },
      { label: 'SMS Alerts', value: 'sms' },
      { label: 'Push Notifications', value: 'push' }
    ]
  },
  validation: {
    schema: z.array(z.string()).min(1, 'Select at least one feature')
  }
}
```

**Modes:**
- **Single:** Returns `boolean` (true/false)
- **Group:** Returns `string[]` (array of selected values)

---

#### [RadioInput.tsx](packages/platform/src/forms/inputs/RadioInput.tsx)
**Purpose:** Radio button groups for exclusive selection

**Features:**
- Canary UI Radio component
- Vertical or horizontal layout
- Optional description per option
- Accessible keyboard navigation (arrow keys)
- Label integration with click-to-select

**InputConfig Options:**
```typescript
{
  options: Array<{       // REQUIRED
    label: string;
    value: string;
    description?: string; // Optional help text
  }>;
  layout?: 'vertical' | 'horizontal'; // Default: 'vertical'
}
```

**Usage Example:**
```typescript
{
  inputType: 'radio',
  path: 'plan',
  label: 'Select Plan',
  required: true,
  inputConfig: {
    layout: 'vertical',
    options: [
      {
        label: 'Free',
        value: 'free',
        description: 'Perfect for getting started'
      },
      {
        label: 'Pro',
        value: 'pro',
        description: 'For professional users'
      },
      {
        label: 'Enterprise',
        value: 'enterprise',
        description: 'For large teams'
      }
    ]
  },
  validation: {
    schema: z.enum(['free', 'pro', 'enterprise'])
  }
}
```

**Key Features:**
- Only one option selectable (exclusive choice)
- Description text shows below each option
- Horizontal layout useful for fewer options

---

#### [FileInput.tsx](packages/platform/src/forms/inputs/FileInput.tsx)
**Purpose:** File upload with drag-and-drop support

**Features:**
- Drag-and-drop zone with visual feedback
- Click-to-upload fallback
- File type filtering (accept attribute)
- File size validation (max size)
- Single or multiple file support
- File preview list with remove buttons
- Visual upload icon and instructions

**InputConfig Options:**
```typescript
{
  accept?: string;        // e.g., '.pdf,.doc' or 'image/*'
  maxSize?: number;       // In bytes (e.g., 5 * 1024 * 1024 for 5MB)
  multiple?: boolean;     // Allow multiple files (default: false)
  showPreview?: boolean;  // Show uploaded file list (default: true)
}
```

**Usage Example:**
```typescript
{
  inputType: 'file',
  path: 'documents',
  label: 'Upload Documents',
  inputConfig: {
    accept: '.pdf,.doc,.docx',
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    showPreview: true
  },
  validation: {
    schema: z.custom<File | File[]>((val) => {
      if (Array.isArray(val)) {
        return val.length > 0;
      }
      return val instanceof File;
    }, 'Please upload at least one file')
  }
}
```

**Key Features:**
- Drag visual feedback (border color change)
- File validation (type and size)
- Multiple file display with individual remove
- Accessibility (file input hidden but functional)
- Shows file name and size in preview

**Value Types:**
- **Single:** `File | null`
- **Multiple:** `File[] | null`

---

### 2. Updated InputFactory

**File:** [input-factory.ts](packages/platform/src/forms/input-factory.ts)

Registered all new input components:

**Before (4 components):**
- TextInput
- TextareaInput
- SelectInput
- BooleanInput

**After (8 components):**
- TextInput
- TextareaInput
- SelectInput
- BooleanInput
- **NumberInput** ✨
- **CheckboxInput** ✨
- **RadioInput** ✨
- **FileInput** ✨

---

### 3. Canary UI Component Integration

**Location:** `/packages/platform/src/components/ui/`

Created centralized integration layer for Canary UI components with convenience utilities.

#### [toast.tsx](packages/platform/src/components/ui/toast.tsx)
**Purpose:** Toast notification system with helper functions

**Exports:**
```typescript
// Direct exports
export { toast, Toaster } from '@harnessio/ui/components';

// Convenience utilities
export const showToast = {
  success: (message, description?) => toast.success(...),
  error: (message, description?) => toast.error(...),
  info: (message, description?) => toast.info(...),
  warning: (message, description?) => toast.warning(...),
  loading: (message) => toast.loading(...),
  promise: (promise, messages) => toast.promise(...)
};
```

**Usage Example:**
```typescript
import { showToast } from '@cortex/platform/components';

// Success notification
showToast.success('Saved successfully');

// Error with description
showToast.error('Failed to save', 'Please try again later');

// Promise-based (auto loading → success/error)
showToast.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Saved successfully',
    error: 'Failed to save'
  }
);
```

#### [index.ts](packages/platform/src/components/ui/index.ts)
**Purpose:** Single import point for all Canary UI components

**Re-exported Components:**
- **Notifications:** Toast, Toaster, Alert, AlertDialog
- **Forms:** Button, Input, Textarea, Select, Switch, Checkbox, Radio, Label
- **Dialogs:** Dialog, Popover, Tooltip, DropdownMenu
- **Layout:** Card, Tabs, Separator, Accordion, Progress
- **Data:** Avatar, Badge

**Benefits:**
- Consistent import pattern across platform
- Easy to update when Canary UI changes
- Central place for custom wrappers/utilities
- Tree-shaking friendly (re-exports)

---

## 📊 Code Metrics

| Metric | Value |
|--------|-------|
| New Input Components | 4 |
| Total Input Components | 8 (doubled!) |
| Lines of Code | ~900 |
| InputConfig Interfaces | 4 |
| Canary Components Integrated | 30+ |
| Helper Functions | 6 (showToast utilities) |

---

## 🎨 Component Features Matrix

| Component | Single/Multi | Validation | Visual Feedback | Accessibility | File Size |
|-----------|-------------|------------|-----------------|---------------|-----------|
| NumberInput | Single | Min/Max/Step | ▲▼ Buttons | ARIA, Disabled states | ~120 lines |
| CheckboxInput | Both | Boolean/Array | Check marks | ARIA, Labels | ~110 lines |
| RadioInput | Single | Enum | Radio dots | ARIA, Keyboard nav | ~100 lines |
| FileInput | Both | Type/Size | Drag visual | ARIA, Preview | ~250 lines |

---

## 🔄 Before & After Comparison

### Number Input

**Before (Custom HTML):**
```typescript
<input
  type="number"
  value={port}
  onChange={e => setPort(Number(e.target.value))}
  min={1}
  max={65535}
/>
```

**After (NumberInput):**
```typescript
{
  inputType: 'number',
  path: 'port',
  inputConfig: { min: 1, max: 65535, step: 1 },
  validation: { schema: z.coerce.number().min(1).max(65535) }
}
```

**Benefits:**
- ✅ Increment/decrement buttons
- ✅ Automatic validation
- ✅ Consistent styling
- ✅ Error display

### File Upload

**Before (Manual):**
```typescript
const [file, setFile] = useState<File | null>(null);
const [dragging, setDragging] = useState(false);

<div
  onDrop={e => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setDragging(false);
  }}
  onDragOver={e => { e.preventDefault(); setDragging(true); }}
>
  <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
</div>
```

**After (FileInput):**
```typescript
{
  inputType: 'file',
  path: 'document',
  inputConfig: {
    accept: '.pdf,.doc',
    maxSize: 10 * 1024 * 1024
  }
}
```

**Benefits:**
- ✅ Drag-drop built-in
- ✅ File type validation
- ✅ Size validation
- ✅ Preview with remove
- ✅ ~200 lines of code eliminated

---

## ✨ Key Achievements

### Developer Experience
- ✅ 8 input types available (doubled from 4)
- ✅ Declarative file upload (no manual drag-drop code)
- ✅ Number controls with constraints
- ✅ Checkbox groups for multi-select
- ✅ Radio buttons with descriptions
- ✅ Centralized Canary UI imports
- ✅ Toast helper functions

### User Experience
- ✅ Visual drag-drop feedback
- ✅ File upload preview
- ✅ Number increment/decrement buttons
- ✅ Checkbox/radio accessible labels
- ✅ Option descriptions for clarity

### Code Quality
- ✅ Consistent input component pattern
- ✅ All components extend InputComponent
- ✅ Type-safe with generics
- ✅ ARIA accessibility throughout
- ✅ Reusable configurations

---

## 🔍 Component Usage Patterns

### Pattern 1: Number with Constraints
```typescript
{
  inputType: 'number',
  path: 'retryCount',
  label: 'Max Retries',
  inputConfig: {
    min: 0,
    max: 10,
    step: 1,
    showControls: true
  },
  validation: {
    schema: z.coerce.number().min(0).max(10)
  },
  default: 3
}
```

### Pattern 2: Checkbox Group
```typescript
{
  inputType: 'checkbox',
  path: 'permissions',
  label: 'Permissions',
  inputConfig: {
    options: [
      { label: 'Read', value: 'read' },
      { label: 'Write', value: 'write' },
      { label: 'Delete', value: 'delete' }
    ]
  },
  validation: {
    schema: z.array(z.string()).min(1, 'Select at least one permission')
  }
}
```

### Pattern 3: Radio with Descriptions
```typescript
{
  inputType: 'radio',
  path: 'scoreType',
  label: 'Scorer Type',
  inputConfig: {
    layout: 'vertical',
    options: [
      {
        label: 'Binary',
        value: 'binary',
        description: 'Simple pass/fail scoring'
      },
      {
        label: 'Numeric',
        value: 'numeric',
        description: 'Score from 0-100'
      },
      {
        label: 'Custom',
        value: 'custom',
        description: 'Define your own scoring logic'
      }
    ]
  },
  validation: {
    schema: z.enum(['binary', 'numeric', 'custom'])
  }
}
```

### Pattern 4: File Upload with Preview
```typescript
{
  inputType: 'file',
  path: 'datasetFile',
  label: 'Upload Dataset',
  inputConfig: {
    accept: '.csv,.json,.jsonl',
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    showPreview: true
  },
  validation: {
    schema: z.custom<File>((val) => val instanceof File, 'File required')
  }
}
```

### Pattern 5: Toast Notifications
```typescript
import { showToast } from '@cortex/platform/components';

// In form submit handler
const handleSubmit = async (values) => {
  try {
    await saveData(values);
    showToast.success('Dataset created successfully');
  } catch (error) {
    showToast.error('Failed to create dataset', error.message);
  }
};

// Promise-based (auto loading → success/error)
await showToast.promise(
  createDataset(values),
  {
    loading: 'Creating dataset...',
    success: 'Dataset created',
    error: 'Failed to create dataset'
  }
);
```

---

## 📁 File Structure

```
packages/platform/src/
├── forms/
│   ├── inputs/
│   │   ├── TextInput.tsx
│   │   ├── TextareaInput.tsx
│   │   ├── SelectInput.tsx
│   │   ├── BooleanInput.tsx
│   │   ├── NumberInput.tsx          ✨ NEW
│   │   ├── CheckboxInput.tsx        ✨ NEW
│   │   ├── RadioInput.tsx           ✨ NEW
│   │   ├── FileInput.tsx            ✨ NEW
│   │   └── index.ts                 (updated)
│   ├── input-factory.ts             (updated)
│   └── index.ts
│
└── components/
    ├── ui/
    │   ├── toast.tsx                 ✨ NEW
    │   └── index.ts                  ✨ NEW
    └── index.ts                       ✨ NEW
```

---

## 🎯 Ready for Evals Feature

All components needed for Evals feature enhancement are now available:

### Dataset Management Forms
- ✅ **TextInput** - Dataset name
- ✅ **TextareaInput** - Dataset description
- ✅ **FileInput** - Upload dataset files (CSV, JSON, JSONL)
- ✅ **RadioInput** - Dataset type selection
- ✅ **CheckboxInput** - Dataset options/flags
- ✅ **Toast** - Success/error notifications

### Scorer Configuration Forms
- ✅ **SelectInput** - Scorer type dropdown
- ✅ **RadioInput** - Scoring method (binary, numeric, custom)
- ✅ **NumberInput** - Threshold values (with min/max)
- ✅ **CheckboxInput** - Feature flags
- ✅ **TextareaInput** - Custom scorer logic

### UI Enhancements
- ✅ **Toast** - Replace inline error messages
- ✅ **Badge** - Status indicators (from Canary integration)
- ✅ **Tabs** - Organize dataset/scorer views
- ✅ **Dialog** - Create/edit modals
- ✅ **Progress** - Upload progress indicators

---

## 💡 Lessons Learned

1. **NumberInput Complexity**: Increment/decrement buttons require careful disabled state management (at min/max)
2. **FileInput Validation**: File validation should happen in form definition AND component for immediate feedback
3. **Checkbox Modes**: Single vs. group checkbox requires type inference (boolean vs string[])
4. **Radio Descriptions**: Adding descriptions improves UX significantly for complex choices
5. **Toast Integration**: Helper functions (`showToast.*`) reduce boilerplate and improve consistency
6. **Component Pattern**: Established pattern (extend InputComponent, use Canary UI, error handling) scales well

---

## 🚀 Next: Phase 4 Week 3-4 - Evals Feature Enhancement

With the expanded component library, we're ready to enhance the Evals feature:

### Week 3-4 Tasks (2-3 days)

**1. Dataset Management**
- Create Dataset Form (name, description, type, file upload)
- Edit Dataset Form
- Dataset Items Upload (FileInput with CSV/JSON validation)
- Import/Export functionality

**2. Scorer Configuration**
- Create Scorer Form (name, type, configuration)
- Scorer Rules Form (RadioInput for type, NumberInput for thresholds)
- Edit Scorer Settings

**3. Results Enhancement**
- Replace ResultsTable with Canary DataTable
- Add filtering and sorting
- Results export functionality
- Status badges for datasets/scorers

**4. UI/UX Polish**
- Replace all inline errors with Toast notifications
- Add Tabs for organizing views (Datasets, Scorers, Results)
- Add StatusBadge for status indicators
- Add Progress for upload operations
- Add DropdownMenu for bulk actions

---

## 📚 References

### New Components Documentation
- **NumberInput:** Numeric input with increment/decrement, min/max, step
- **CheckboxInput:** Single or group checkboxes
- **RadioInput:** Radio button groups with optional descriptions
- **FileInput:** Drag-drop file upload with validation

### Integration Documentation
- **Toast:** Notification system with helper functions
- **Canary UI:** Centralized component imports

### Pattern Documentation
- **Forms Package:** `/canary/packages/forms/agent.md`
- **Week 1 Summary:** `PHASE_4_WEEK_1_COMPLETE.md`
- **Forms Implementation:** `FORMS_IMPLEMENTATION.md`

---

**Implementation Date:** 2026-03-23
**Duration:** ~3 hours
**Status:** ✅ Complete
**Next Phase:** Phase 4 Week 3-4 - Evals Feature Enhancement
**Overall Progress:** Phase 1 ✅ | Phase 2 ✅ | Phase 3 Week 1-2 ✅ | Phase 3 Week 3 ✅ | Phase 4 Week 1 ✅ | Phase 4 Week 2 ✅

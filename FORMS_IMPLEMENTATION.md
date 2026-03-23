# Forms Implementation Guide

## Overview

Successfully integrated `@harnessio/forms` package into cortex-ui with custom input components using the Canary Design System. The ProfilePage has been enhanced to demonstrate the forms package in action.

## ✅ What Was Built

### 1. Forms Infrastructure

**Location:** `/packages/platform/src/forms/`

#### Custom Input Components

Created four custom input components that extend `InputComponent` from `@harnessio/forms` and use Canary UI components:

1. **[TextInput.tsx](packages/platform/src/forms/inputs/TextInput.tsx)**
   - For single-line text fields
   - Uses Canary `Input` component
   - Supports type variants (text, email, url, etc.)
   - Built-in error display

2. **[TextareaInput.tsx](packages/platform/src/forms/inputs/TextareaInput.tsx)**
   - For multi-line text fields
   - Uses Canary `Textarea` component
   - Configurable rows via `inputConfig`
   - Built-in error display

3. **[SelectInput.tsx](packages/platform/src/forms/inputs/SelectInput.tsx)**
   - For dropdown selection
   - Uses Canary `Select` component
   - Requires `inputConfig.options` array
   - Built-in error display

4. **[BooleanInput.tsx](packages/platform/src/forms/inputs/BooleanInput.tsx)**
   - For toggle/checkbox fields
   - Uses Canary `Switch` component
   - Built-in error display

**Features:**
- ✅ TypeScript generics for type safety
- ✅ Automatic error handling and display
- ✅ ARIA accessibility attributes
- ✅ Canary Design System integration
- ✅ Consistent styling with design tokens

#### Input Factory

**File:** [input-factory.ts](packages/platform/src/forms/input-factory.ts)

Registers all custom input components for use with `RenderForm`:

```typescript
import { inputFactory } from '@cortex/platform';
```

### 2. Enhanced ProfilePage

**Original:** [ProfilePage.tsx](packages/platform/src/features/account/pages/ProfilePage.tsx) (preserved)
**Enhanced:** [ProfilePageEnhanced.tsx](packages/platform/src/features/account/pages/ProfilePageEnhanced.tsx) (now active)

#### Form Definition

**File:** [profile-form.ts](packages/platform/src/features/account/forms/profile-form.ts)

```typescript
export const profileFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Full Name',
      placeholder: 'John Doe',
      required: true,
      validation: {
        schema: z.string().min(2, 'Name must be at least 2 characters'),
      },
    },
    {
      inputType: 'text',
      path: 'email',
      label: 'Email Address',
      placeholder: 'john@example.com',
      required: true,
      validation: {
        schema: z.string().email('Please enter a valid email address'),
      },
      inputConfig: { type: 'email' },
    },
    {
      inputType: 'text',
      path: 'avatar',
      label: 'Avatar URL',
      placeholder: 'https://example.com/avatar.jpg',
      required: false,
      validation: {
        schema: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
      },
      inputConfig: { type: 'url' },
    },
  ],
};
```

#### Key Improvements

**Before (Manual Form Handling):**
```typescript
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!name.trim()) {
    setError('Name is required');
    return;
  }
  if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
    setError('Valid email is required');
    return;
  }
  // ...
};
```

**After (@harnessio/forms):**
```typescript
const resolver = useZodValidationResolver(profileFormDefinition, {
  requiredMessage: 'This field is required',
});

const defaultValues = {
  ...collectDefaultValues(profileFormDefinition.inputs),
  name: user?.name || '',
  email: user?.email || '',
  avatar: user?.avatar || '',
};

const handleSubmit = async (values: ProfileFormData) => {
  // Form is already validated, values are type-safe
  updateUser(values);
};
```

**Benefits:**
- ✅ No manual state management
- ✅ Automatic validation with Zod schemas
- ✅ Type-safe form values
- ✅ Declarative field configuration
- ✅ Reduced boilerplate (from ~60 lines to ~30 lines)
- ✅ Consistent error handling
- ✅ Real-time avatar preview with form.watch()

## 📦 Dependencies Added

Added to [packages/platform/package.json](packages/platform/package.json):

```json
{
  "dependencies": {
    "@harnessio/forms": "^0.7.0",
    "@hookform/resolvers": "^3.9.0",
    "lodash-es": "^4.17.21",
    "react-hook-form": "^7.28.0",
    "uuid": "^8.3.0",
    "zod": "^3.23.8"
  }
}
```

## 🚀 Usage Guide

### Creating a New Form

#### Step 1: Define Form Structure

```typescript
// features/my-feature/forms/my-form.ts
import { type IFormDefinition } from '@harnessio/forms';
import { z } from 'zod';

export interface MyFormData {
  title: string;
  description?: string;
  isEnabled: boolean;
}

export const myFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'title',
      label: 'Title',
      required: true,
      validation: {
        schema: z.string().min(3, 'Title must be at least 3 characters'),
      },
    },
    {
      inputType: 'textarea',
      path: 'description',
      label: 'Description',
      placeholder: 'Optional description',
      inputConfig: {
        rows: 4,
      },
    },
    {
      inputType: 'boolean',
      path: 'isEnabled',
      label: 'Enable feature',
      default: false,
    },
  ],
};
```

#### Step 2: Use in Component

```typescript
import { RootForm, RenderForm, collectDefaultValues, useZodValidationResolver } from '@cortex/platform';
import { inputFactory } from '@cortex/platform';
import { myFormDefinition, type MyFormData } from '../forms/my-form';

export function MyFormComponent() {
  const resolver = useZodValidationResolver(myFormDefinition);
  const defaultValues = collectDefaultValues(myFormDefinition.inputs);

  const handleSubmit = async (values: MyFormData) => {
    console.log('Form values:', values);
    // Call API, update state, etc.
  };

  return (
    <RootForm
      defaultValues={defaultValues}
      resolver={resolver}
      onSubmit={handleSubmit}
      mode="onSubmit"
      validateAfterFirstSubmit={true}
    >
      {(rootForm) => (
        <div className="space-y-6">
          <RenderForm factory={inputFactory} formDefinition={myFormDefinition} />
          <Button onClick={() => rootForm.submitForm()}>Submit</Button>
        </div>
      )}
    </RootForm>
  );
}
```

### Available Input Types

| Input Type | Component | Use Case | Config |
|------------|-----------|----------|--------|
| `text` | TextInput | Single-line text | `{ type?: 'text' \| 'email' \| 'url' }` |
| `textarea` | TextareaInput | Multi-line text | `{ rows?: number }` |
| `select` | SelectInput | Dropdown selection | `{ options: Array<{label, value}> }` (required) |
| `boolean` | BooleanInput | Toggle/Checkbox | None |

### Validation Patterns

#### Required Field
```typescript
{
  inputType: 'text',
  path: 'name',
  required: true,
  validation: {
    schema: z.string().min(1, 'Name is required')
  }
}
```

#### Email
```typescript
{
  inputType: 'text',
  path: 'email',
  required: true,
  validation: {
    schema: z.string().email('Invalid email address')
  },
  inputConfig: { type: 'email' }
}
```

#### URL (Optional)
```typescript
{
  inputType: 'text',
  path: 'website',
  validation: {
    schema: z.string().url('Invalid URL').optional().or(z.literal(''))
  },
  inputConfig: { type: 'url' }
}
```

#### Select with Enum
```typescript
{
  inputType: 'select',
  path: 'status',
  required: true,
  inputConfig: {
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  },
  validation: {
    schema: z.enum(['active', 'inactive'])
  }
}
```

### Advanced Patterns

#### Conditional Field Visibility
```typescript
{
  inputType: 'text',
  path: 'apiKey',
  label: 'API Key',
  isVisible: (values) => values.authType === 'token',
  validation: {
    schema: z.string().min(1, 'API key required')
  }
}
```

#### Dynamic Validation
```typescript
{
  inputType: 'number',
  path: 'maxRetries',
  label: 'Max Retries',
  validation: {
    schema: (values) => {
      const max = values.tier === 'premium' ? 10 : 3;
      return z.coerce.number().max(max, `Maximum ${max} retries`);
    }
  }
}
```

#### Watch Form Values
```typescript
<RootForm ...>
  {(rootForm) => {
    const formValues = rootForm.watch();

    return (
      <div>
        <p>Current name: {formValues.name}</p>
        <RenderForm ... />
      </div>
    );
  }}
</RootForm>
```

## 📁 File Structure

```
packages/platform/src/
├── forms/
│   ├── inputs/
│   │   ├── TextInput.tsx          # Text input component
│   │   ├── TextareaInput.tsx      # Textarea component
│   │   ├── SelectInput.tsx        # Select dropdown component
│   │   ├── BooleanInput.tsx       # Switch/toggle component
│   │   └── index.ts               # Input exports
│   ├── input-factory.ts           # InputFactory with all inputs registered
│   └── index.ts                   # Forms package exports
│
└── features/
    └── account/
        ├── forms/
        │   ├── profile-form.ts    # ProfilePage form definition
        │   └── index.ts           # Form exports
        └── pages/
            ├── ProfilePage.tsx             # Original (preserved)
            └── ProfilePageEnhanced.tsx     # Enhanced with forms (active)
```

## 🔄 Migration Path

To migrate an existing form to use @harnessio/forms:

### 1. Identify Form Fields
Map current state variables to form paths:
```typescript
// Before
const [name, setName] = useState('');
const [email, setEmail] = useState('');

// After (form definition)
{
  inputs: [
    { inputType: 'text', path: 'name', ... },
    { inputType: 'text', path: 'email', ... },
  ]
}
```

### 2. Extract Validation Logic
Convert validation to Zod schemas:
```typescript
// Before
if (!name.trim()) {
  setError('Name is required');
}
if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
  setError('Valid email is required');
}

// After (Zod schema)
validation: {
  schema: z.string().min(1, 'Name is required')
}
validation: {
  schema: z.string().email('Valid email is required')
}
```

### 3. Replace Form Handling
```typescript
// Before
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  // Manual validation...
  // Handle submit...
};

// After
const handleSubmit = async (values: FormData) => {
  // Values are already validated and type-safe
  // Handle submit...
};
```

## ✨ Next Steps

### Week 3 Remaining Work

1. **Enhance AccountSettingsPage** - Settings form with select dropdowns
2. **Enhance APIKeysPage** - API key creation form with validation
3. **Enhance CreateProjectDialog** - Project creation modal form
4. **Enhance ProjectSettingsPage** - Project settings with danger zone

### Future Enhancements

- **NumberInput** - For numeric fields with increment/decrement
- **DateInput** - For date/time selection
- **FileInput** - For file uploads
- **MultiselectInput** - For multi-select dropdowns
- **ListInput** - For dynamic arrays (key-value pairs)
- **GroupInput** - For nested field grouping

## 📚 References

- **Forms Package Docs:** `/canary/packages/forms/agent.md`
- **Canary UI Components:** `/canary/packages/ui/src/components/`
- **Design System Docs:** `/cortex-ui/packages/design-system/DESIGN_SYSTEM.md`
- **ProfilePage Enhanced:** [ProfilePageEnhanced.tsx](packages/platform/src/features/account/pages/ProfilePageEnhanced.tsx)

## 🎯 Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **State Management** | Manual useState for each field | Automatic with React Hook Form |
| **Validation** | Manual checks with regex | Declarative Zod schemas |
| **Error Handling** | Manual error state | Automatic field-level errors |
| **Type Safety** | Loose typing | Fully type-safe with TypeScript |
| **Code Volume** | ~60-80 lines per form | ~30-40 lines per form |
| **Reusability** | Copy-paste boilerplate | Declarative form definitions |
| **Consistency** | Varies per developer | Standardized pattern |
| **Accessibility** | Manual ARIA attributes | Automatic accessibility |

---

**Implementation Date:** 2026-03-23
**Status:** ✅ Complete
**Next Phase:** Week 3 - Account & Project Forms Enhancement

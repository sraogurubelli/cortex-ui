# Testing Guide

This document describes the testing strategy and practices for the Cortex UI monorepo.

## Overview

- **Test Runner**: Vitest
- **Test Library**: React Testing Library
- **Coverage Tool**: @vitest/coverage-v8
- **Test Environment**: jsdom

## Coverage Targets

Current coverage thresholds (can be increased over time):

- **Statements**: 50%
- **Branches**: 40%
- **Functions**: 50%
- **Lines**: 50%

## Running Tests

### Run All Tests

```bash
# From monorepo root
pnpm --filter @cortex/core-ui test

# Or from apps/cortex-core-ui
cd apps/cortex-core-ui
pnpm test
```

### Run Tests with UI

```bash
pnpm --filter @cortex/core-ui test:ui
```

Opens an interactive UI for running and debugging tests at http://localhost:51204

### Run Tests with Coverage

```bash
pnpm --filter @cortex/core-ui test:coverage
```

Generates coverage reports in:

- `apps/cortex-core-ui/coverage/` (HTML report)
- Console output (text summary)

## Writing Tests

### Test File Structure

```
src/
├── components/
│   └── MyComponent/
│       ├── MyComponent.tsx
│       └── __tests__/
│           └── MyComponent.test.tsx
└── utils/
    ├── myUtil.ts
    └── __tests__/
        └── myUtil.test.ts
```

### Basic Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@cortex/core';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(
      <TestWrapper>
        <MyComponent title="Test" />
      </TestWrapper>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Using TestWrapper

The `TestWrapper` component provides all necessary contexts for testing:

- **Router**: BrowserRouter or MemoryRouter
- **QueryClient**: React Query client with test defaults

#### Basic Usage

```typescript
import { TestWrapper } from '@cortex/core';

render(
  <TestWrapper>
    <MyComponent />
  </TestWrapper>
);
```

#### With Initial Routes

```typescript
render(
  <TestWrapper initialEntries={['/evals/datasets']}>
    <MyComponent />
  </TestWrapper>
);
```

#### With Custom QueryClient

```typescript
const customQueryClient = new QueryClient({
  /* custom config */
});

render(
  <TestWrapper queryClient={customQueryClient}>
    <MyComponent />
  </TestWrapper>
);
```

## Testing Patterns

### Testing Components

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestWrapper } from '@cortex/core';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Button onClick={handleClick}>Click me</Button>
      </TestWrapper>
    );

    await user.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Testing Async Operations

```typescript
import { describe, it, expect, waitFor } from 'vitest';

describe('DataFetcher', () => {
  it('loads and displays data', async () => {
    render(
      <TestWrapper>
        <DataFetcher />
      </TestWrapper>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });
  });
});
```

### Mocking API Calls

```typescript
import { vi } from 'vitest';

vi.mock('@cortex/platform', () => ({
  useDatasets: vi.fn(() => ({
    data: { items: [], total_elements: 0 },
    isLoading: false,
  })),
}));
```

### Testing Hooks

```typescript
import { renderHook } from '@testing-library/react';
import { TestWrapper } from '@cortex/core';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('returns correct value', () => {
    const { result } = renderHook(() => useMyHook(), {
      wrapper: TestWrapper,
    });

    expect(result.current.value).toBe('expected');
  });
});
```

## What to Test

### Priority 1: Critical Business Logic

- Utility functions
- Custom hooks
- Data transformations
- API integration logic

### Priority 2: User Interactions

- Form submissions
- Button clicks
- Navigation
- Error states

### Priority 3: Component Rendering

- Props handling
- Conditional rendering
- Edge cases

### What NOT to Test

- Third-party library internals
- Simple prop forwarding
- Trivial components (wrappers with no logic)
- Visual styling (use visual regression testing instead)

## Best Practices

### 1. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => {});

// ✅ Good
it('displays error message when API call fails', () => {});
```

### 2. Test User Behavior, Not Implementation

```typescript
// ❌ Bad - testing implementation
expect(component.state.isOpen).toBe(true);

// ✅ Good - testing user-visible behavior
expect(screen.getByRole('dialog')).toBeInTheDocument();
```

### 3. Use Testing Library Queries Correctly

Priority order:

1. `getByRole` - Most accessible
2. `getByLabelText` - For form inputs
3. `getByPlaceholderText` - For inputs
4. `getByText` - For non-interactive content
5. `getByTestId` - Last resort

```typescript
// ✅ Preferred
screen.getByRole('button', { name: /submit/i });

// ⚠️ Use sparingly
screen.getByTestId('submit-button');
```

### 4. Clean Up After Tests

```typescript
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

### 5. Mock Console Methods

```typescript
import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
```

## Debugging Tests

### Run Single Test File

```bash
pnpm test MyComponent.test.tsx
```

### Run Tests in Watch Mode

```bash
pnpm test --watch
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test", "--inspect-brk", "--no-coverage"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Common Issues

### Issue: "Cannot find module '@cortex/core'"

**Solution**: Ensure path aliases are configured in `vitest.config.ts`:

```typescript
resolve: {
  alias: {
    '@cortex/core': path.resolve(__dirname, '../../packages/core/src'),
  },
}
```

### Issue: Tests fail with "window is not defined"

**Solution**: Ensure `environment: 'jsdom'` is set in vitest.config.ts

### Issue: React hooks error in tests

**Solution**: Wrap component in TestWrapper:

```typescript
render(
  <TestWrapper>
    <MyComponent />
  </TestWrapper>
);
```

## CI/CD Integration

Tests are automatically run:

- **Pre-commit**: Prevented by lint-staged (optional, currently disabled)
- **Pull Requests**: Run via CI (when configured)
- **Before Deploy**: Part of build pipeline

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

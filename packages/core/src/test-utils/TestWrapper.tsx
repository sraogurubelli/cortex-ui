import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface TestWrapperProps {
  children: React.ReactNode;
  /**
   * Initial route for MemoryRouter
   * If provided, uses MemoryRouter; otherwise uses BrowserRouter
   */
  initialEntries?: string[];
  /**
   * Initial index for MemoryRouter
   */
  initialIndex?: number;
  /**
   * Custom QueryClient instance
   */
  queryClient?: QueryClient;
}

/**
 * TestWrapper - Provides all necessary context for component testing
 *
 * Wraps components with:
 * - Router (MemoryRouter or BrowserRouter based on initialEntries)
 * - QueryClientProvider
 *
 * Usage:
 * ```tsx
 * render(
 *   <TestWrapper initialEntries={['/evals/datasets']}>
 *     <MyComponent />
 *   </TestWrapper>
 * )
 * ```
 */
export function TestWrapper({
  children,
  initialEntries,
  initialIndex = 0,
  queryClient,
}: TestWrapperProps) {
  // Create default QueryClient if not provided
  const testQueryClient =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries in tests
          gcTime: 0, // Disable caching
        },
        mutations: {
          retry: false,
        },
      },
    });

  // Use MemoryRouter if initialEntries provided, otherwise BrowserRouter
  const Router = initialEntries ? MemoryRouter : BrowserRouter;
  const routerProps = initialEntries ? { initialEntries, initialIndex } : {};

  return (
    <QueryClientProvider client={testQueryClient}>
      <Router {...routerProps}>{children}</Router>
    </QueryClientProvider>
  );
}

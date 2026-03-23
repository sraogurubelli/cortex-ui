import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../useAuth';

const apiRequestMock = vi.fn();

vi.mock('../../api/client', () => ({
  apiRequest: (...args: unknown[]) => apiRequestMock(...args),
}));

const tokenMocks = vi.hoisted(() => ({
  getAuthToken: vi.fn<[], string | null>(),
  setAuthToken: vi.fn(),
  getStoredUser: vi.fn(),
  setStoredUser: vi.fn(),
  setRefreshToken: vi.fn(),
  clearAuthStorage: vi.fn(),
}));

vi.mock('../tokenStorage', () => tokenMocks);

describe('AuthProvider', () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    tokenMocks.getAuthToken.mockReturnValue(null);
    tokenMocks.getStoredUser.mockReturnValue(null);
    tokenMocks.setAuthToken.mockReset();
    tokenMocks.setStoredUser.mockReset();
    tokenMocks.setRefreshToken.mockReset();
    tokenMocks.clearAuthStorage.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children', () => {
    render(
      <AuthProvider>
        <span data-testid="child">inside</span>
      </AuthProvider>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('inside');
  });

  it('login calls API and sets user', async () => {
    apiRequestMock.mockImplementation(async (path: string) => {
      if (path === '/api/v1/auth/login') {
        return {
          access_token: 'access',
          refresh_token: 'refresh',
          token_type: 'bearer',
          expires_in: 3600,
        };
      }
      if (path === '/api/v1/auth/me') {
        return {
          id: 'user-1',
          email: 'u@example.com',
          display_name: 'Test User',
          principal_type: 'user',
          admin: false,
          blocked: false,
          created_at: '2020-01-01T00:00:00Z',
        };
      }
      throw new Error(`unexpected path ${path}`);
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({ email: 'u@example.com', password: 'secret' });
    });

    expect(apiRequestMock).toHaveBeenCalledWith('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'u@example.com' }),
    });
    expect(apiRequestMock).toHaveBeenCalledWith('/api/v1/auth/me');
    expect(tokenMocks.setAuthToken).toHaveBeenCalledWith('access');
    expect(tokenMocks.setRefreshToken).toHaveBeenCalledWith('refresh');
    expect(result.current.user).toMatchObject({
      id: 'user-1',
      email: 'u@example.com',
      name: 'Test User',
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout clears user', async () => {
    apiRequestMock.mockImplementation(async (path: string) => {
      if (path === '/api/v1/auth/login') {
        return {
          access_token: 'a',
          refresh_token: 'r',
          token_type: 'bearer',
          expires_in: 3600,
        };
      }
      if (path === '/api/v1/auth/me') {
        return {
          id: '1',
          email: 'x@y.com',
          display_name: 'X',
          principal_type: 'user',
          admin: false,
          blocked: false,
          created_at: '2020-01-01T00:00:00Z',
        };
      }
      if (path === '/api/v1/auth/logout') {
        return undefined;
      }
      throw new Error(`unexpected ${path}`);
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({ email: 'x@y.com', password: 'p' });
    });
    expect(result.current.user).not.toBeNull();

    await act(async () => {
      await result.current.logout();
    });

    expect(tokenMocks.clearAuthStorage).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('bootstrap with existing token calls /me', async () => {
    tokenMocks.getAuthToken.mockReturnValue('existing-jwt');
    apiRequestMock.mockResolvedValue({
      id: 'boot-1',
      email: 'boot@example.com',
      display_name: 'Boot User',
      principal_type: 'user',
      admin: false,
      blocked: false,
      created_at: '2021-01-01T00:00:00Z',
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiRequestMock).toHaveBeenCalledWith('/api/v1/auth/me');
    expect(result.current.user).toMatchObject({
      id: 'boot-1',
      email: 'boot@example.com',
      name: 'Boot User',
    });
  });
});

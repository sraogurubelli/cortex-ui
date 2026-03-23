import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getAuthToken,
  setAuthToken,
  getStoredUser,
  setStoredUser,
  setRefreshToken,
  clearAuthStorage,
} from './tokenStorage';
import { apiRequest } from '../api/client';
import type { TokenResponse, UserInfo } from '../api/types';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  displayName: string;
  accountName?: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  /**
   * Optional custom login function.
   * If not provided, calls the cortex-ai /api/v1/auth/login endpoint.
   */
  onLogin?: (credentials: LoginCredentials) => Promise<{ token: string; user: User }>;
  onLogout?: () => Promise<void> | void;
}

function userInfoToUser(info: UserInfo): User {
  return {
    id: info.id,
    email: info.email,
    name: info.display_name,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(info.display_name)}&background=random`,
  };
}

function storeTokens(tokens: TokenResponse): void {
  setAuthToken(tokens.access_token);
  setRefreshToken(tokens.refresh_token);
}

export function AuthProvider({ children, onLogin, onLogout }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Bootstrap session: if we have a token, fetch current user from the API
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Try stored user first for instant render, then validate with API
    const stored = getStoredUser();
    if (stored) setUser(stored);

    apiRequest<UserInfo>('/api/v1/auth/me')
      .then(info => {
        const u = userInfoToUser(info);
        setStoredUser(u);
        setUser(u);
      })
      .catch(() => {
        clearAuthStorage();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      try {
        if (onLogin) {
          const result = await onLogin(credentials);
          setAuthToken(result.token);
          setStoredUser(result.user);
          setUser(result.user);
          return;
        }

        const tokens = await apiRequest<TokenResponse>('/api/v1/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: credentials.email }),
        });
        storeTokens(tokens);

        const info = await apiRequest<UserInfo>('/api/v1/auth/me');
        const u = userInfoToUser(info);
        setStoredUser(u);
        setUser(u);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [onLogin],
  );

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    try {
      const tokens = await apiRequest<TokenResponse>('/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          display_name: data.displayName,
          account_name: data.accountName,
        }),
      });
      storeTokens(tokens);

      const info = await apiRequest<UserInfo>('/api/v1/auth/me');
      const u = userInfoToUser(info);
      setStoredUser(u);
      setUser(u);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (onLogout) {
        await onLogout();
      }
      // Best-effort server-side logout
      try {
        await apiRequest('/api/v1/auth/logout', { method: 'POST' });
      } catch {
        // Ignore – client clears tokens regardless
      }
      clearAuthStorage();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onLogout]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      setStoredUser(updatedUser);
      return updatedUser;
    });
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

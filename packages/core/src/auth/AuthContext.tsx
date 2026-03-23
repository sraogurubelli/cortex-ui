import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  clearAuthStorage,
  type StoredUser,
} from './tokenStorage';

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

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  /**
   * Optional custom login function
   * If not provided, uses mock authentication
   */
  onLogin?: (credentials: LoginCredentials) => Promise<{ token: string; user: User }>;
  /**
   * Optional custom logout function
   */
  onLogout?: () => Promise<void> | void;
}

/**
 * AuthProvider - Manages authentication state
 *
 * Usage:
 * ```tsx
 * <AuthProvider onLogin={handleLogin} onLogout={handleLogout}>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children, onLogin, onLogout }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);

      try {
        let token: string;
        let userData: User;

        if (onLogin) {
          // Use custom login function
          const result = await onLogin(credentials);
          token = result.token;
          userData = result.user;
        } else {
          // Mock authentication
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Mock successful login
          token = `mock_token_${Date.now()}`;
          userData = {
            id: '1',
            email: credentials.email,
            name: credentials.email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${credentials.email.split('@')[0]}&background=random`,
          };
        }

        // Store token and user
        setAuthToken(token);
        setStoredUser(userData);
        setUser(userData);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [onLogin]
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      if (onLogout) {
        await onLogout();
      }

      // Clear storage and state
      clearAuthStorage();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onLogout]);

  /**
   * Update user information
   */
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
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

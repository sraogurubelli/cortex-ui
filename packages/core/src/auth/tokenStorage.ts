/**
 * Token storage utilities
 * Handles storing and retrieving auth tokens from localStorage
 */

const TOKEN_KEY = 'cortex_auth_token';
const REFRESH_TOKEN_KEY = 'cortex_refresh_token';
const USER_KEY = 'cortex_user';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

/**
 * Store authentication token
 */
export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return null;
  }
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
}

/**
 * Store refresh token
 */
export function setRefreshToken(token: string): void {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store refresh token:', error);
  }
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve refresh token:', error);
    return null;
  }
}

/**
 * Remove refresh token
 */
export function removeRefreshToken(): void {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove refresh token:', error);
  }
}

/**
 * Store user information
 */
export function setStoredUser(user: StoredUser): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store user:', error);
  }
}

/**
 * Get stored user information
 */
export function getStoredUser(): StoredUser | null {
  try {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    return null;
  }
}

/**
 * Remove stored user information
 */
export function removeStoredUser(): void {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to remove user:', error);
  }
}

/**
 * Clear all auth-related storage
 */
export function clearAuthStorage(): void {
  removeAuthToken();
  removeRefreshToken();
  removeStoredUser();
}

/**
 * Check if user is authenticated (has valid token)
 */
export function hasAuthToken(): boolean {
  return !!getAuthToken();
}

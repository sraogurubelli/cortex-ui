/**
 * Authentication module
 * Provides authentication context, hooks, and components
 */

export { AuthProvider, AuthContext } from './AuthContext';
export type { User, LoginCredentials, SignupData, AuthContextValue } from './AuthContext';

export { useAuth } from './useAuth';

export { ProtectedRoute } from './ProtectedRoute';

export {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  setStoredUser,
  getStoredUser,
  removeStoredUser,
  clearAuthStorage,
  hasAuthToken,
} from './tokenStorage';
export type { StoredUser } from './tokenStorage';

/**
 * Account module
 * Provides account context and user preferences management
 */

export { AccountProvider, useAccountContext } from './AccountContext';
export type { AccountContextValue } from './AccountContext';

export { useAccount } from './useAccount';

export {
  getPreferences,
  setPreferences,
  updatePreferences,
  clearPreferences,
} from './accountStorage';

export type { UserPreferences, UpdatePreferencesInput } from './types';
export { DEFAULT_PREFERENCES } from './types';

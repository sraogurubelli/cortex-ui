import { useAccountContext } from './AccountContext';

/**
 * Hook to access account context
 * Provides user preferences and methods to update them
 */
export function useAccount() {
  return useAccountContext();
}

import { createContext, useContext, useState, useCallback } from 'react';
import type { UserPreferences, UpdatePreferencesInput } from './types';
import { DEFAULT_PREFERENCES } from './types';
import { getPreferences, setPreferences as savePreferences } from './accountStorage';

export interface AccountContextValue {
  preferences: UserPreferences;
  updatePreferences: (updates: UpdatePreferencesInput) => void;
  resetPreferences: () => void;
  isLoading: boolean;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

interface AccountProviderProps {
  children: React.ReactNode;
  initialPreferences?: UserPreferences;
}

export function AccountProvider({ children, initialPreferences }: AccountProviderProps) {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    return initialPreferences || getPreferences();
  });

  const [isLoading] = useState(false);

  const updatePreferences = useCallback((updates: UpdatePreferencesInput) => {
    setPreferencesState(current => {
      const updated = { ...current, ...updates };
      savePreferences(updated);
      return updated;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferencesState(DEFAULT_PREFERENCES);
    savePreferences(DEFAULT_PREFERENCES);
  }, []);

  return (
    <AccountContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        isLoading,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext(): AccountContextValue {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
}

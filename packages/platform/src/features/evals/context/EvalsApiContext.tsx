/**
 * Evals API base URL context. Cortex only.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createEvalsApiClient, type EvalsApiClient } from '../api/client';

const EvalsApiContext = createContext<EvalsApiClient | null>(null);

export interface EvalsApiProviderProps {
  baseUrl: string;
  children: ReactNode;
}

export function EvalsApiProvider({ baseUrl, children }: EvalsApiProviderProps) {
  const client = useMemo(() => createEvalsApiClient(baseUrl), [baseUrl]);
  return (
    <EvalsApiContext.Provider value={client}>
      {children}
    </EvalsApiContext.Provider>
  );
}

export function useEvalsApi(): EvalsApiClient {
  const client = useContext(EvalsApiContext);
  if (!client) {
    throw new Error('useEvalsApi must be used within EvalsApiProvider');
  }
  return client;
}

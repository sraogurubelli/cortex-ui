import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EvalsApiProvider } from '@cortex/platform';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const evalsBaseUrl = import.meta.env.VITE_AI_EVALS_API_URL ?? '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <EvalsApiProvider baseUrl={evalsBaseUrl}>
        <App />
      </EvalsApiProvider>
    </QueryClientProvider>
  </StrictMode>,
);

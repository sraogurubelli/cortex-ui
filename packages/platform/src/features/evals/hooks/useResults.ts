import { useQuery } from '@tanstack/react-query';
import { useEvalsApi } from '../context/EvalsApiContext';

export function useResults(page = 0, limit = 10) {
  const api = useEvalsApi();
  return useQuery({
    queryKey: ['evals', 'runs', page, limit],
    queryFn: () => api.listRuns(page, limit),
  });
}

export function useRun(runId: string | null) {
  const api = useEvalsApi();
  return useQuery({
    queryKey: ['evals', 'run', runId],
    queryFn: () =>
      runId ? api.getRun(runId) : Promise.reject(new Error('No run id')),
    enabled: !!runId,
  });
}

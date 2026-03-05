import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEvalsApi } from '../context/EvalsApiContext';
import type { CreateScorerRequest, UpdateScorerRequest } from '../api/types';

export function useScorers(page = 0, limit = 10) {
  const api = useEvalsApi();
  return useQuery({
    queryKey: ['evals', 'scorers', page, limit],
    queryFn: () => api.listScorers(page, limit),
  });
}

export function useScorer(scorerUuid: string | null) {
  const api = useEvalsApi();
  return useQuery({
    queryKey: ['evals', 'scorer', scorerUuid],
    queryFn: () =>
      scorerUuid ? api.getScorer(scorerUuid) : Promise.reject(new Error('No uuid')),
    enabled: !!scorerUuid,
  });
}

export function useCreateScorer() {
  const queryClient = useQueryClient();
  const api = useEvalsApi();
  return useMutation({
    mutationFn: (body: CreateScorerRequest) => api.createScorer(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evals', 'scorers'] });
    },
  });
}

export function useUpdateScorer(scorerUuid: string) {
  const queryClient = useQueryClient();
  const api = useEvalsApi();
  return useMutation({
    mutationFn: (body: UpdateScorerRequest) => api.updateScorer(scorerUuid, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evals', 'scorers'] });
      queryClient.invalidateQueries({ queryKey: ['evals', 'scorer', scorerUuid] });
    },
  });
}

export function useDeleteScorer() {
  const queryClient = useQueryClient();
  const api = useEvalsApi();
  return useMutation({
    mutationFn: (scorerUuid: string) => api.deleteScorer(scorerUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evals', 'scorers'] });
    },
  });
}

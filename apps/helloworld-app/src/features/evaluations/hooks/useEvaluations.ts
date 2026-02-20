import { useQuery } from '@tanstack/react-query';
import { evaluationsApi } from '../api/evaluationsApi';
import type { Evaluation } from '../types';

export const useEvaluations = () => {
  return useQuery<Evaluation[]>({
    queryKey: ['evaluations'],
    queryFn: () => evaluationsApi.getAll(),
  });
};

export const useEvaluation = (id: string) => {
  return useQuery<Evaluation | null>({
    queryKey: ['evaluations', id],
    queryFn: () => evaluationsApi.getById(id),
    enabled: !!id,
  });
};

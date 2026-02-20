import { useQuery } from '@tanstack/react-query';
import { agentsApi } from '../api/agentsApi';
import type { Agent } from '../types';

export const useAgents = () => {
  return useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: () => agentsApi.getAll(),
  });
};

export const useAgent = (id: string) => {
  return useQuery<Agent | null>({
    queryKey: ['agents', id],
    queryFn: () => agentsApi.getById(id),
    enabled: !!id,
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEvalsApi } from '../context/EvalsApiContext';
import type { CreateDatasetRequest, UpdateDatasetRequest } from '../api/types';

export function useDatasets(page = 0, limit = 10) {
  const api = useEvalsApi();
  return useQuery({
    queryKey: ['evals', 'datasets', page, limit],
    queryFn: () => api.listDatasets(page, limit),
  });
}

export function useDataset(datasetUuid: string | null) {
  const api = useEvalsApi();
  return useQuery({
    queryKey: ['evals', 'dataset', datasetUuid],
    queryFn: () => (datasetUuid ? api.getDataset(datasetUuid) : Promise.reject(new Error('No uuid'))),
    enabled: !!datasetUuid,
  });
}

export function useCreateDataset() {
  const queryClient = useQueryClient();
  const api = useEvalsApi();
  return useMutation({
    mutationFn: (body: CreateDatasetRequest) => api.createDataset(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evals', 'datasets'] });
    },
  });
}

export function useUpdateDataset(datasetUuid: string) {
  const queryClient = useQueryClient();
  const api = useEvalsApi();
  return useMutation({
    mutationFn: (body: UpdateDatasetRequest) => api.updateDataset(datasetUuid, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evals', 'datasets'] });
      queryClient.invalidateQueries({ queryKey: ['evals', 'dataset', datasetUuid] });
    },
  });
}

export function useDeleteDataset() {
  const queryClient = useQueryClient();
  const api = useEvalsApi();
  return useMutation({
    mutationFn: (datasetUuid: string) => api.deleteDataset(datasetUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evals', 'datasets'] });
    },
  });
}

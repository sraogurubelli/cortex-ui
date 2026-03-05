import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEvalsApi } from '../context/EvalsApiContext';
import type {
  CreateDatasetItemRequest,
  UpdateDatasetItemRequest,
} from '../api/types';

export function useDatasetItems(datasetUuid: string | null, page = 0, limit = 100) {
  const api = useEvalsApi();
  return useQuery({
    queryKey: ['evals', 'dataset-items', datasetUuid, page, limit],
    queryFn: () =>
      datasetUuid
        ? api.listDatasetItems(datasetUuid, page, limit)
        : Promise.reject(new Error('No dataset uuid')),
    enabled: !!datasetUuid,
  });
}

export function useCreateDatasetItem(datasetUuid: string) {
  const queryClient = useQueryClient();
  const api = useEvalsApi();
  return useMutation({
    mutationFn: (body: CreateDatasetItemRequest) =>
      api.createDatasetItem(datasetUuid, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evals', 'dataset-items', datasetUuid] });
      queryClient.invalidateQueries({ queryKey: ['evals', 'dataset', datasetUuid] });
    },
  });
}

export function useUpdateDatasetItem(datasetUuid: string, itemUuid: string) {
  const queryClient = useQueryClient();
  const api = useEvalsApi();
  return useMutation({
    mutationFn: (body: UpdateDatasetItemRequest) =>
      api.updateDatasetItem(datasetUuid, itemUuid, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evals', 'dataset-items', datasetUuid] });
    },
  });
}

export function useDeleteDatasetItem(datasetUuid: string) {
  const queryClient = useQueryClient();
  const api = useEvalsApi();
  return useMutation({
    mutationFn: (itemUuid: string) => api.deleteDatasetItem(datasetUuid, itemUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evals', 'dataset-items', datasetUuid] });
      queryClient.invalidateQueries({ queryKey: ['evals', 'dataset', datasetUuid] });
    },
  });
}

/**
 * Thin fetch client for aiEvals API. Cortex only; base URL from context.
 * Paths follow OpenAPI: /evals/api/v1/orgs/{org}/projects/{project}/...
 */

import type {
  EvalsDatasetListResponse,
  EvalsDatasetResponse,
  CreateDatasetRequest,
  UpdateDatasetRequest,
  DatasetItemListResponse,
  DatasetItemResponse,
  CreateDatasetItemRequest,
  UpdateDatasetItemRequest,
  ScorerListResponse,
  ScorerResponse,
  CreateScorerRequest,
  UpdateScorerRequest,
  RunListResponse,
  RunResponse,
  ErrorResponse,
} from './types';

const DEFAULT_ORG = 'default';
const DEFAULT_PROJECT = 'default';

function ensureSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function basePath(baseUrl: string): string {
  const b = ensureSlash(baseUrl);
  return `${b}/evals/api/v1/orgs/${DEFAULT_ORG}/projects/${DEFAULT_PROJECT}`;
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  const text = await res.text();
  if (!res.ok) {
    let message = res.statusText;
    try {
      const err: ErrorResponse = JSON.parse(text);
      if (err.message) message = err.message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export function createEvalsApiClient(baseUrl: string) {
  const base = basePath(baseUrl);

  return {
    // Datasets
    listDatasets: (page = 0, limit = 10) =>
      request<EvalsDatasetListResponse>(`${base}/dataset?page=${page}&limit=${limit}`),
    getDataset: (datasetUuid: string) =>
      request<EvalsDatasetResponse>(`${base}/dataset/${datasetUuid}`),
    createDataset: (body: CreateDatasetRequest) =>
      request<EvalsDatasetResponse>(`${base}/dataset`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    updateDataset: (datasetUuid: string, body: UpdateDatasetRequest) =>
      request<EvalsDatasetResponse>(`${base}/dataset/${datasetUuid}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    deleteDataset: (datasetUuid: string) =>
      request<void>(`${base}/dataset/${datasetUuid}`, { method: 'DELETE' }),

    // Dataset items
    listDatasetItems: (datasetUuid: string, page = 0, limit = 100) =>
      request<DatasetItemListResponse>(
        `${base}/dataset/${datasetUuid}/items?page=${page}&limit=${limit}`
      ),
    getDatasetItem: (datasetUuid: string, itemUuid: string) =>
      request<DatasetItemResponse>(`${base}/dataset/${datasetUuid}/items/${itemUuid}`),
    createDatasetItem: (datasetUuid: string, body: CreateDatasetItemRequest) =>
      request<DatasetItemResponse>(`${base}/dataset/${datasetUuid}/items`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    updateDatasetItem: (
      datasetUuid: string,
      itemUuid: string,
      body: UpdateDatasetItemRequest
    ) =>
      request<DatasetItemResponse>(`${base}/dataset/${datasetUuid}/items/${itemUuid}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    deleteDatasetItem: (datasetUuid: string, itemUuid: string) =>
      request<void>(`${base}/dataset/${datasetUuid}/items/${itemUuid}`, {
        method: 'DELETE',
      }),

    // Scorers
    listScorers: (page = 0, limit = 10) =>
      request<ScorerListResponse>(`${base}/scorer?page=${page}&limit=${limit}`),
    getScorer: (scorerUuid: string) =>
      request<ScorerResponse>(`${base}/scorer/${scorerUuid}`),
    createScorer: (body: CreateScorerRequest) =>
      request<ScorerResponse>(`${base}/scorer`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    updateScorer: (scorerUuid: string, body: UpdateScorerRequest) =>
      request<ScorerResponse>(`${base}/scorer/${scorerUuid}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    deleteScorer: (scorerUuid: string) =>
      request<void>(`${base}/scorer/${scorerUuid}`, { method: 'DELETE' }),

    // Runs (results)
    listRuns: (page = 0, limit = 10) =>
      request<RunListResponse>(`${base}/runs?page=${page}&limit=${limit}`),
    getRun: (runId: string) =>
      request<RunResponse>(`${base}/runs/${runId}`),
  };
}

export type EvalsApiClient = ReturnType<typeof createEvalsApiClient>;

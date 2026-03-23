/**
 * Documents API Client
 *
 * Wraps cortex-ai /api/v1/projects/{uid}/documents and /search endpoints.
 */

import { apiRequest } from '@cortex/core';
import type { DocumentList, SearchResponse, IngestResponse } from '@cortex/core';

export async function listDocuments(projectUid: string, limit = 50): Promise<DocumentList> {
  return apiRequest<DocumentList>(
    `/api/v1/projects/${projectUid}/documents?limit=${limit}`,
  );
}

export async function uploadDocument(
  projectUid: string,
  file: File,
): Promise<IngestResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<IngestResponse>(
    `/api/v1/projects/${projectUid}/documents`,
    { method: 'POST', body: formData },
  );
}

export async function deleteDocument(
  projectUid: string,
  docId: string,
): Promise<void> {
  await apiRequest<void>(
    `/api/v1/projects/${projectUid}/documents/${docId}`,
    { method: 'DELETE' },
  );
}

export async function searchDocuments(
  projectUid: string,
  query: string,
  topK = 5,
): Promise<SearchResponse> {
  return apiRequest<SearchResponse>(
    `/api/v1/projects/${projectUid}/search`,
    {
      method: 'POST',
      body: JSON.stringify({ query, top_k: topK }),
    },
  );
}

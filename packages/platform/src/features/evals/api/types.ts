/**
 * Types for aiEvals API (cortex-only; aligns with OpenAPI schema).
 */

export interface EvalsDatasetResponse {
  uuid: string;
  name: string;
  identifier: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  item_count?: number;
  metadata?: Record<string, unknown>;
}

export interface EvalsDatasetListResponse {
  data: EvalsDatasetResponse[];
  page: number;
  limit: number;
  total_elements: number;
}

export interface CreateDatasetRequest {
  name: string;
  identifier: string;
  description?: string;
  items?: unknown[];
  metadata?: Record<string, unknown>;
}

export interface UpdateDatasetRequest {
  name?: string;
  identifier?: string;
  description?: string;
  items?: unknown[];
  metadata?: Record<string, unknown>;
}

export interface DatasetItemResponse {
  uuid: string;
  input?: Record<string, unknown>;
  expected_output?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface DatasetItemListResponse {
  data: DatasetItemResponse[];
  page: number;
  limit: number;
  total_elements: number;
}

export interface CreateDatasetItemRequest {
  input?: Record<string, unknown>;
  expected_output?: Record<string, unknown> | null;
}

export interface UpdateDatasetItemRequest {
  input?: Record<string, unknown>;
  expected_output?: Record<string, unknown> | null;
}

export interface ScorerResponse {
  uuid: string;
  name: string;
  identifier: string;
  type: string;
  description?: string;
  config?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface ScorerListResponse {
  data: ScorerResponse[];
  page: number;
  limit: number;
  total_elements: number;
}

export interface CreateScorerRequest {
  name: string;
  identifier: string;
  type: string;
  description?: string;
  config?: Record<string, unknown>;
}

export interface UpdateScorerRequest {
  name?: string;
  identifier?: string;
  type?: string;
  description?: string;
  config?: Record<string, unknown>;
}

export interface RunResponse {
  run_id: string;
  name?: string | null;
  status: string;
  started_at?: string | null;
  completed_at?: string | null;
  total_items?: number | null;
  success_count?: number | null;
  failed_count?: number | null;
  summary_scores?: Record<string, number> | null;
  metadata?: Record<string, unknown>;
}

export interface RunListResponse {
  data: RunResponse[];
  page: number;
  limit: number;
  total_elements: number;
}

export interface ErrorResponse {
  message: string;
}

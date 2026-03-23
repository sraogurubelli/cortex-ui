/**
 * Cortex API client
 *
 * Shared fetch wrapper with JWT auth, automatic token refresh, and error handling.
 * Base URL is configured via VITE_CORTEX_API_URL (defaults to '' for same-origin / dev proxy).
 */

import {
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
  clearAuthStorage,
} from '../auth/tokenStorage';

let _baseUrl: string | undefined;

export function getApiBaseUrl(): string {
  if (_baseUrl !== undefined) return _baseUrl;
  if (typeof import.meta !== 'undefined') {
    _baseUrl = (import.meta as any).env?.VITE_CORTEX_API_URL ?? '';
  } else {
    _baseUrl = '';
  }
  return _baseUrl!;
}

export function setApiBaseUrl(url: string): void {
  _baseUrl = url;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let _refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    setAuthToken(data.access_token);
    setRefreshToken(data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

/**
 * Core fetch wrapper. Automatically attaches Bearer token and retries once
 * on 401 by refreshing the access token.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData (browser sets multipart boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  }

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(url, { ...options, headers });

  // Retry once on 401 via refresh
  if (res.status === 401 && getRefreshToken()) {
    if (!_refreshPromise) {
      _refreshPromise = attemptTokenRefresh().finally(() => {
        _refreshPromise = null;
      });
    }

    const refreshed = await _refreshPromise;
    if (refreshed) {
      const newToken = getAuthToken();
      if (newToken) headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    }
  }

  // Handle auth failure after retry
  if (res.status === 401) {
    clearAuthStorage();
    window.location.href = '/signin';
    throw new ApiError(401, 'Session expired');
  }

  // No-content responses
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!res.ok) {
    let message = res.statusText;
    let body: unknown;
    try {
      body = JSON.parse(text);
      message = (body as any)?.detail ?? (body as any)?.message ?? message;
    } catch {
      if (text) message = text;
    }
    throw new ApiError(res.status, message, body);
  }

  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/**
 * Streaming fetch for SSE endpoints (POST with Bearer token).
 * Returns a ReadableStream of parsed SSE events.
 */
export async function apiStream(
  path: string,
  body: unknown,
): Promise<ReadableStream<{ event: string; data: string }>> {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = res.statusText;
    try {
      const err = JSON.parse(text);
      message = err?.detail ?? err?.message ?? message;
    } catch {
      if (text) message = text;
    }
    throw new ApiError(res.status, message);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');

      let currentEvent = '';
      let currentData = '';

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          currentData = line.slice(6).trim();
        } else if (line.trim() === '' && (currentEvent || currentData)) {
          controller.enqueue({
            event: currentEvent || 'message',
            data: currentData,
          });
          currentEvent = '';
          currentData = '';
        }
      }
    },
  });
}

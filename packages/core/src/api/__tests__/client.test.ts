import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  apiRequest,
  apiStream,
  ApiError,
  setApiBaseUrl,
} from '../client';

const tokenStorage = vi.hoisted(() => ({
  getAuthToken: vi.fn<[], string | null>(),
  getRefreshToken: vi.fn<[], string | null>(),
  setAuthToken: vi.fn(),
  setRefreshToken: vi.fn(),
  clearAuthStorage: vi.fn(),
}));

vi.mock('../../auth/tokenStorage', () => tokenStorage);

describe('api client', () => {
  const originalFetch = globalThis.fetch;
  let locationHref = '';

  beforeEach(() => {
    setApiBaseUrl('http://api.test');
    globalThis.fetch = vi.fn();
    tokenStorage.getAuthToken.mockReturnValue(null);
    tokenStorage.getRefreshToken.mockReturnValue(null);
    tokenStorage.setAuthToken.mockReset();
    tokenStorage.setRefreshToken.mockReset();
    tokenStorage.clearAuthStorage.mockReset();
    locationHref = '';
    vi.stubGlobal('location', {
      get href() {
        return locationHref;
      },
      set href(v: string) {
        locationHref = v;
      },
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllGlobals();
  });

  it('apiRequest makes correct fetch call for path and method', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await apiRequest('/api/v1/foo', { method: 'POST', body: JSON.stringify({ a: 1 }) });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://api.test/api/v1/foo',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ a: 1 }),
      }),
    );
  });

  it('apiRequest attaches Bearer token from storage', async () => {
    tokenStorage.getAuthToken.mockReturnValue('access-xyz');
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );

    await apiRequest('/api/v1/protected');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://api.test/api/v1/protected',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer access-xyz',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('apiRequest retries once on 401 when refresh token exists and succeeds', async () => {
    let accessToken = 'old-access';
    tokenStorage.getAuthToken.mockImplementation(() => accessToken);
    tokenStorage.getRefreshToken.mockReturnValue('refresh-token');
    tokenStorage.setAuthToken.mockImplementation((t: string) => {
      accessToken = t;
    });

    vi.mocked(globalThis.fetch)
      .mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            access_token: 'new-access',
            refresh_token: 'new-refresh',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 1 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    const data = await apiRequest<{ result: number }>('/api/v1/data');

    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      'http://api.test/api/v1/auth/refresh',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refresh_token: 'refresh-token' }),
      }),
    );
    expect(tokenStorage.setAuthToken).toHaveBeenCalledWith('new-access');
    expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith('new-refresh');
    expect(data).toEqual({ result: 1 });
  });

  it('apiRequest throws ApiError on non-OK JSON body with detail', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'Not allowed' }), {
        status: 403,
        statusText: 'Forbidden',
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const err = await apiRequest('/api/v1/x').catch(e => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({
      name: 'ApiError',
      status: 403,
      message: 'Not allowed',
    });
  });

  it('apiRequest returns undefined for 204', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(new Response(null, { status: 204 }));

    const out = await apiRequest<undefined>('/api/v1/gone');
    expect(out).toBeUndefined();
  });

  it('apiStream returns ReadableStream of SSE events', async () => {
    tokenStorage.getAuthToken.mockReturnValue('tok');
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('event: token\ndata: hello\n\n'));
        controller.close();
      },
    });

    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } }),
    );

    const stream = await apiStream('/api/v1/chat', { message: 'hi' });
    const reader = stream.getReader();
    const first = await reader.read();
    expect(first.done).toBe(false);
    expect(first.value).toEqual({ event: 'token', data: 'hello' });
    const end = await reader.read();
    expect(end.done).toBe(true);
  });

  it('apiStream throws ApiError when response is not ok', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'bad stream' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(apiStream('/api/v1/s', {})).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
      message: 'bad stream',
    });
  });
});

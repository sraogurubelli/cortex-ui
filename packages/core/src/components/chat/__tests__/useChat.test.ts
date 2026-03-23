import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useChat } from '../useChat';

const apiRequestMock = vi.fn();
const apiStreamMock = vi.fn();

vi.mock('../../../api/client', () => ({
  apiRequest: (...args: unknown[]) => apiRequestMock(...args),
  apiStream: (...args: unknown[]) => apiStreamMock(...args),
}));

describe('useChat', () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
    apiStreamMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('initializes with empty messages and threads', () => {
    const { result } = renderHook(() => useChat({ projectUid: 'proj-1' }));
    expect(result.current.messages).toEqual([]);
    expect(result.current.threads).toEqual([]);
    expect(result.current.activeThreadId).toBeUndefined();
    expect(result.current.isStreaming).toBe(false);
  });

  it('loadThreads fetches conversations', async () => {
    apiRequestMock.mockResolvedValueOnce({
      conversations: [
        {
          id: 'c1',
          title: 'First',
          last_message: 'hi',
          updated_at: '2025-01-01T12:00:00Z',
        },
      ],
    });

    const { result } = renderHook(() => useChat({ projectUid: 'proj-1' }));

    await act(async () => {
      await result.current.loadThreads();
    });

    expect(apiRequestMock).toHaveBeenCalledWith(
      '/api/v1/projects/proj-1/conversations?limit=50&offset=0',
    );
    expect(result.current.threads).toHaveLength(1);
    expect(result.current.threads[0]).toMatchObject({
      id: 'c1',
      title: 'First',
      preview: 'hi',
    });
  });

  it('sendMessage posts to API via apiStream and refreshes threads', async () => {
    apiStreamMock.mockResolvedValueOnce(
      new ReadableStream({
        start(controller) {
          controller.close();
        },
      }),
    );
    apiRequestMock.mockResolvedValueOnce({ conversations: [] });

    const { result } = renderHook(() => useChat({ projectUid: 'proj-9' }));

    await act(async () => {
      await result.current.sendMessage('hello world');
    });

    expect(apiStreamMock).toHaveBeenCalledWith('/api/v1/projects/proj-9/chat/stream', {
      message: 'hello world',
      conversation_id: undefined,
      stream: true,
      model: undefined,
    });
    expect(apiRequestMock).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isStreaming).toBe(false));
    expect(result.current.messages.some(m => m.role === 'user' && m.content === 'hello world')).toBe(
      true,
    );
  });

  it('newThread resets messages and active thread', async () => {
    apiRequestMock.mockResolvedValueOnce({
      conversations: [{ id: 't1', title: 'T', updated_at: '2025-01-02T00:00:00Z' }],
    });

    const { result } = renderHook(() => useChat({ projectUid: 'p' }));

    await act(async () => {
      await result.current.loadThreads();
    });

    apiRequestMock.mockResolvedValueOnce({
      id: 't1',
      messages: [
        {
          id: 'm1',
          role: 'user',
          content: 'x',
          created_at: '2025-01-01T00:00:00Z',
        },
      ],
    });

    await act(async () => {
      await result.current.selectThread('t1');
    });
    expect(result.current.messages.length).toBeGreaterThan(0);

    act(() => {
      result.current.newThread();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.activeThreadId).toBeUndefined();
  });

  it('deleteThread removes thread from list', async () => {
    apiRequestMock
      .mockResolvedValueOnce({
        conversations: [
          { id: 'a', title: 'A', updated_at: '2025-01-01T00:00:00Z' },
          { id: 'b', title: 'B', updated_at: '2025-01-02T00:00:00Z' },
        ],
      })
      .mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useChat({ projectUid: 'p' }));

    await act(async () => {
      await result.current.loadThreads();
    });
    expect(result.current.threads.map(t => t.id)).toEqual(['a', 'b']);

    await act(async () => {
      await result.current.deleteThread('a');
    });

    expect(apiRequestMock).toHaveBeenCalledWith('/api/v1/conversations/a', { method: 'DELETE' });
    expect(result.current.threads.map(t => t.id)).toEqual(['b']);
  });
});

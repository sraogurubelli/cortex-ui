/**
 * useChat – React hook for streaming chat with the cortex-ai backend.
 *
 * Manages messages, SSE streaming, conversation persistence, and thread history.
 */

import { useState, useCallback, useRef } from 'react';
import { apiStream, apiRequest } from '../../api/client';
import type {
  ConversationList,
  ConversationDetail,
  ConversationSummary,
} from '../../api/types';
import type { ChatMessage, ChatThread, UIActionEvent, UIActionHandler } from './types';

interface UseChatOptions {
  projectUid: string;
  model?: string;
  /** Called when the agent emits a ui_action SSE event. */
  onUIAction?: UIActionHandler;
}

interface UseChatReturn {
  messages: ChatMessage[];
  threads: ChatThread[];
  activeThreadId: string | undefined;
  isStreaming: boolean;
  sendMessage: (text: string) => Promise<void>;
  selectThread: (threadId: string) => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;
  newThread: () => void;
  loadThreads: () => Promise<void>;
}

function summaryToThread(s: ConversationSummary): ChatThread {
  return {
    id: s.id,
    title: s.title ?? 'Untitled',
    preview: s.last_message ?? undefined,
    lastActivity: new Date(s.updated_at),
    unreadCount: 0,
  };
}

export function useChat({ projectUid, model, onUIAction }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();
  const [isStreaming, setIsStreaming] = useState(false);
  const conversationIdRef = useRef<string | undefined>();

  const loadThreads = useCallback(async () => {
    try {
      const res = await apiRequest<ConversationList>(
        `/api/v1/projects/${projectUid}/conversations?limit=50&offset=0`,
      );
      setThreads(res.conversations.map(summaryToThread));
    } catch (err) {
      console.error('Failed to load threads:', err);
    }
  }, [projectUid]);

  const selectThread = useCallback(
    async (threadId: string) => {
      setActiveThreadId(threadId);
      try {
        const detail = await apiRequest<ConversationDetail>(
          `/api/v1/conversations/${threadId}`,
        );
        conversationIdRef.current = detail.id;
        setMessages(
          detail.messages.map(m => ({
            id: m.id,
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content,
            timestamp: new Date(m.created_at),
          })),
        );
      } catch (err) {
        console.error('Failed to load conversation:', err);
      }
    },
    [],
  );

  const deleteThread = useCallback(
    async (threadId: string) => {
      try {
        await apiRequest(`/api/v1/conversations/${threadId}`, { method: 'DELETE' });
        if (conversationIdRef.current === threadId) {
          conversationIdRef.current = undefined;
          setActiveThreadId(undefined);
          setMessages([]);
        }
        setThreads(prev => prev.filter(t => t.id !== threadId));
      } catch (err) {
        console.error('Failed to delete conversation:', err);
      }
    },
    [],
  );

  const newThread = useCallback(() => {
    conversationIdRef.current = undefined;
    setActiveThreadId(undefined);
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: `usr_${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);

      const assistantId = `ast_${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        streaming: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsStreaming(true);

      try {
        const stream = await apiStream(
          `/api/v1/projects/${projectUid}/chat/stream`,
          {
            message: text,
            conversation_id: conversationIdRef.current,
            stream: true,
            model,
          },
        );

        const reader = stream.getReader();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value.event === 'token') {
            let tokenText = value.data;
            try {
              const parsed = JSON.parse(value.data);
              tokenText = typeof parsed === 'string' ? parsed : parsed.content ?? parsed.text ?? value.data;
            } catch {
              // data is raw text
            }
            accumulated += tokenText;
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId ? { ...m, content: accumulated } : m,
              ),
            );
          } else if (value.event === 'done') {
            try {
              const doneData = JSON.parse(value.data);
              conversationIdRef.current = doneData.conversation_id;
              if (doneData.conversation_id && !activeThreadId) {
                setActiveThreadId(doneData.conversation_id);
              }
            } catch {
              // ignore parse errors
            }
          } else if (value.event === 'ui_action') {
            try {
              const action: UIActionEvent = JSON.parse(value.data);
              onUIAction?.(action);
            } catch {
              console.warn('Failed to parse ui_action event:', value.data);
            }
          } else if (value.event === 'error') {
            let errText = value.data;
            try {
              errText = JSON.parse(value.data).error ?? value.data;
            } catch {
              // raw error string
            }
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: `Error: ${errText}`, streaming: false }
                  : m,
              ),
            );
          }
        }

        // Mark streaming done
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId ? { ...m, streaming: false } : m,
          ),
        );

        // Refresh thread list so the new conversation shows up
        await loadThreads();
      } catch (err) {
        console.error('Chat stream error:', err);
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: `Error: ${String(err)}`, streaming: false }
              : m,
          ),
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [projectUid, model, activeThreadId, loadThreads],
  );

  return {
    messages,
    threads,
    activeThreadId,
    isStreaming,
    sendMessage,
    selectThread,
    deleteThread,
    newThread,
    loadThreads,
  };
}

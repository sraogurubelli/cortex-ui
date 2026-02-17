/**
 * MIT License
 * Copyright (c) 2025 SynterAIQ
 * 
 * ChatHistory Component
 * 
 * Searchable list of conversation threads with infinite scroll, loading states,
 * and thread selection.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatThread {
  id: string;
  title: string;
  updatedAt?: Date;
  createdAt?: Date;
  conversationId?: string;
}

export interface ChatHistoryProps {
  threads: ChatThread[];
  currentThreadId?: string;
  onSelectThread?: (threadId: string) => void;
  onSearch?: (query: string) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  threads,
  currentThreadId,
  onSelectThread,
  onSearch,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  searchPlaceholder = 'Search your chats...',
  emptyMessage = 'No chat history yet',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;
    setIsLoadingMore(true);
    try {
      await onLoadMore?.();
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, isLoading, onLoadMore]);

  // Infinite scroll with intersection observer
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && !isLoading) {
          handleLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, handleLoadMore]);

  const filteredThreads = searchTerm
    ? threads.filter((thread) =>
        thread.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : threads;

  return (
    <div className={`cortex-chat-history ${className}`}>
      <div className="cortex-chat-history-header">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="cortex-chat-history-search"
        />
      </div>

      <div className="cortex-chat-history-content">
        {isLoading && threads.length === 0 ? (
          <div className="cortex-chat-history-loading">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="cortex-chat-history-skeleton">
                <div className="cortex-chat-history-skeleton-line" />
              </div>
            ))}
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="cortex-chat-history-empty">
            <div className="cortex-chat-history-empty-icon">💬</div>
            <div className="cortex-chat-history-empty-text">
              {searchTerm ? 'No matching chats found' : emptyMessage}
            </div>
          </div>
        ) : (
          <>
            <div className="cortex-chat-history-list">
              {filteredThreads.map((thread) => {
                const isActive = thread.id === currentThreadId;
                return (
                  <div
                    key={thread.id}
                    className={`cortex-chat-history-item ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectThread?.(thread.id)}
                  >
                    <div className="cortex-chat-history-item-title">{thread.title || 'Untitled Chat'}</div>
                    {thread.updatedAt && (
                      <div className="cortex-chat-history-item-time">
                        {formatTimeAgo(thread.updatedAt)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="cortex-chat-history-sentinel">
              {isLoadingMore && (
                <div className="cortex-chat-history-loading-more">Loading more...</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

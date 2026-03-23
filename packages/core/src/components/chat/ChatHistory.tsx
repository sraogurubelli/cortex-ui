/**
 * ChatHistory - Displays a list of conversation threads with filtering
 */

import type { ChatHistoryProps } from './types';

export function ChatHistory({
  threads,
  activeThreadId,
  onSelectThread,
  onDeleteThread,
  searchQuery = '',
  className = '',
}: ChatHistoryProps) {
  const filtered = searchQuery
    ? threads.filter(
        t =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.preview?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : threads;

  if (filtered.length === 0) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <span className="text-sm text-cn-text-foreground-3">
          {searchQuery ? 'No conversations found' : 'No conversations yet'}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {filtered.map(thread => {
        const isActive = thread.id === activeThreadId;
        return (
          <div
            key={thread.id}
            className={`group relative w-full text-left px-3 py-3 border-b border-cn-border-border-1 transition-colors hover:bg-cn-bg-background-2 cursor-pointer ${
              isActive ? 'bg-cn-bg-background-2' : ''
            }`}
            onClick={() => onSelectThread(thread.id)}
          >
            <span
              className={`block truncate pr-6 text-sm ${
                isActive ? 'text-cn-text-foreground-1 font-medium' : 'text-cn-text-foreground-2'
              }`}
            >
              {thread.title}
            </span>
            {thread.preview && (
              <span className="block truncate text-xs text-cn-text-foreground-3 mt-0.5 pr-6">
                {thread.preview}
              </span>
            )}
            {onDeleteThread && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  if (confirm('Delete this conversation?')) {
                    onDeleteThread(thread.id);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded text-cn-text-foreground-3 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Delete conversation"
              >
                ✕
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

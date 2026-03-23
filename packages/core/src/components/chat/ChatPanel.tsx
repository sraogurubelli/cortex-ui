/**
 * ChatPanel - Collapsible sidebar panel for chat threads
 */

import { useState } from 'react';
import { ChatHistory } from './ChatHistory';
import type { ChatPanelProps } from './types';

export function ChatPanel({
  threads,
  activeThreadId,
  onSelectThread,
  onDeleteThread,
  onNewThread,
  collapsible = true,
  defaultCollapsed = false,
  className = '',
}: ChatPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [searchQuery, setSearchQuery] = useState('');

  if (collapsed) {
    return (
      <div className={`bg-cn-bg-background-1 border-r border-cn-border-border-1 ${className}`}>
        <div className="p-2">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full px-3 py-2 border border-cn-border-border-1 rounded text-cn-text-foreground-1 hover:bg-cn-bg-background-2 transition-colors"
          >
            ≡
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col w-64 bg-cn-bg-background-1 border-r border-cn-border-border-1 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 p-3 border-b border-cn-border-border-1">
        <span className="text-sm font-semibold text-cn-text-foreground-1">
          Conversations
        </span>
        <div className="flex gap-1">
          {onNewThread && (
            <button onClick={onNewThread} className="px-2 py-1 text-sm rounded hover:bg-cn-bg-background-2 text-cn-text-foreground-2 transition-colors">
              +
            </button>
          )}
          {collapsible && (
            <button onClick={() => setCollapsed(true)} className="px-2 py-1 text-sm rounded hover:bg-cn-bg-background-2 text-cn-text-foreground-2 transition-colors">
              ‹
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-cn-border-border-1">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-cn-bg-background-2 border border-cn-border-border-1 rounded text-cn-text-foreground-1 placeholder:text-cn-text-foreground-3 focus:outline-none focus:ring-2 focus:ring-cn-brand-primary"
        />
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto">
        <ChatHistory
          threads={threads}
          activeThreadId={activeThreadId}
          onSelectThread={onSelectThread}
          onDeleteThread={onDeleteThread}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}

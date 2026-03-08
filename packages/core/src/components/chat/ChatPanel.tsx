/**
 * ChatPanel - Collapsible sidebar panel for chat threads
 */

import { useState } from 'react';
import { Vertical, Horizontal, Button, Text } from '@harnessio/ui';
import { ChatHistory } from './ChatHistory';
import type { ChatPanelProps } from './types';

export function ChatPanel({
  threads,
  activeThreadId,
  onSelectThread,
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
          <Button
            onClick={() => setCollapsed(false)}
            className="w-full"
            variant="outline"
          >
            ≡
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Vertical
      gap="0"
      className={`w-64 bg-cn-bg-background-1 border-r border-cn-border-border-1 ${className}`}
    >
      {/* Header */}
      <Horizontal
        gap="2"
        align="center"
        justify="space-between"
        className="p-3 border-b border-cn-border-border-1"
      >
        <Text variant="heading-sm" className="text-cn-text-foreground-1">
          Conversations
        </Text>
        <Horizontal gap="1">
          {onNewThread && (
            <Button onClick={onNewThread} variant="ghost" size="sm">
              +
            </Button>
          )}
          {collapsible && (
            <Button onClick={() => setCollapsed(true)} variant="ghost" size="sm">
              ‹
            </Button>
          )}
        </Horizontal>
      </Horizontal>

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
          searchQuery={searchQuery}
        />
      </div>
    </Vertical>
  );
}

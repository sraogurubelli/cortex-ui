/**
 * MIT License
 * Copyright (c) 2025 SynterAIQ
 * 
 * ChatPanel Component
 * 
 * Collapsible sidebar panel with position management (left/right/fullscreen)
 * and smooth transitions.
 */

import React, { useState, useRef, useEffect } from 'react';

export interface ChatPanelProps {
  position?: 'left' | 'right' | 'fullscreen';
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  collapsedWidth?: number;
  fullscreenWidth?: number;
  children: React.ReactNode;
  className?: string;
}

const DEFAULT_COLLAPSED_WIDTH = 60;
const DEFAULT_FULLSCREEN_WIDTH = 800;

export const ChatPanel: React.FC<ChatPanelProps> = ({
  position = 'right',
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapseChange,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  fullscreenWidth = DEFAULT_FULLSCREEN_WIDTH,
  children,
  className = '',
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const containerRef = useRef<HTMLDivElement>(null);

  const collapsed = controlledCollapsed ?? internalCollapsed;
  const isFullscreen = position === 'fullscreen';

  const handleToggle = () => {
    const newCollapsed = !collapsed;
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    onCollapseChange?.(newCollapsed);

    if (!newCollapsed && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getWidth = (): number | undefined => {
    if (isFullscreen) return fullscreenWidth;
    if (collapsed) return collapsedWidth;
    return undefined;
  };

  const width = getWidth();

  if (isFullscreen) {
    return (
      <div
        ref={containerRef}
        className={`cortex-chat-panel cortex-chat-panel-fullscreen ${className}`}
        style={{ width: `${width}px` }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`cortex-chat-panel cortex-chat-panel-${position} ${collapsed ? 'collapsed' : ''} ${className}`}
      style={{
        width: width ? `${width}px` : undefined,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {collapsed ? (
        <div className="cortex-chat-panel-collapsed-content">
          <button
            type="button"
            onClick={handleToggle}
            className="cortex-chat-panel-toggle-button"
            title="Expand"
          >
            ☰
          </button>
        </div>
      ) : (
        <>
          {children}
          <button
            type="button"
            onClick={handleToggle}
            className="cortex-chat-panel-collapse-button"
            title="Collapse"
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};

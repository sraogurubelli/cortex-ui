// @ts-nocheck
/**
 * Enhanced Scorer Card Component
 *
 * Enhanced version using Canary UI components and design tokens.
 */

import type { ReactNode } from 'react';
import { Card } from '@harnessio/ui/components';
import type { ScorerResponse } from '../api/types';

export interface ScorerCardEnhancedProps {
  scorer: ScorerResponse;
  onSelect?: (uuid: string) => void;
}

const badgeVariantClass: Record<string, string> = {
  default: 'border-transparent bg-[var(--cn-bg-3)] text-[var(--cn-text-default)]',
  secondary: 'border-transparent bg-[var(--cn-bg-2)] text-[var(--cn-text-muted)]',
  outline: 'border-[var(--cn-border-default)] text-[var(--cn-text-default)]',
  success: 'border-transparent bg-[var(--cn-success-1)] text-[var(--cn-text-default)]',
  destructive: 'border-transparent bg-[var(--cn-destructive-1)] text-[var(--cn-destructive-foreground)]',
};

function ScorerBadge({
  variant,
  className,
  children,
  ...rest
}: {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'destructive';
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>) {
  const base =
    'inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium';
  const v = variant ?? 'outline';
  return (
    <span
      className={`${base} ${badgeVariantClass[v] || badgeVariantClass.outline} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </span>
  );
}

// Map scorer types to badge variants for visual distinction
const getScorerTypeBadge = (type: string): { variant: 'default' | 'secondary' | 'outline' | 'success' | 'destructive'; label: string } => {
  const typeMap: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'success' | 'destructive'; label: string }> = {
    exact_match: { variant: 'default', label: 'Exact Match' },
    contains: { variant: 'secondary', label: 'Contains' },
    semantic: { variant: 'success', label: 'Semantic' },
    llm_judge: { variant: 'outline', label: 'LLM Judge' },
    custom: { variant: 'destructive', label: 'Custom' }
  };

  return typeMap[type] || { variant: 'outline', label: type };
};

export function ScorerCardEnhanced({ scorer, onSelect }: ScorerCardEnhancedProps) {
  const typeBadge = getScorerTypeBadge(scorer.type);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect?.(scorer.uuid)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(scorer.uuid)}
      tabIndex={0}
      role="article"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-1 truncate" style={{ color: 'var(--cn-text-default)' }}>
            {scorer.name}
          </h3>
          <p className="text-sm font-mono truncate" style={{ color: 'var(--cn-text-subtle)' }}>
            {scorer.identifier}
          </p>
        </div>
        <ScorerBadge variant={typeBadge.variant} className="shrink-0">
          {typeBadge.label}
        </ScorerBadge>
      </div>

      {scorer.description && (
        <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--cn-text-muted)' }}>
          {scorer.description}
        </p>
      )}

      {scorer.config && Object.keys(scorer.config).length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--cn-border-default)' }}>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--cn-text-subtle)' }}>
            Configuration:
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(scorer.config).slice(0, 3).map(([key, value]) => (
              <ScorerBadge key={key} variant="outline" className="text-xs">
                {key}: {String(value)}
              </ScorerBadge>
            ))}
            {Object.keys(scorer.config).length > 3 && (
              <ScorerBadge variant="outline" className="text-xs">
                +{Object.keys(scorer.config).length - 3} more
              </ScorerBadge>
            )}
          </div>
        </div>
      )}

      {(scorer.created_at || scorer.updated_at) && (
        <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid var(--cn-border-default)' }}>
          {scorer.created_at && (
            <div className="text-xs" style={{ color: 'var(--cn-text-subtle)' }}>
              Created: {new Date(scorer.created_at).toLocaleDateString()}
            </div>
          )}
          {scorer.updated_at && (
            <div className="text-xs" style={{ color: 'var(--cn-text-subtle)' }}>
              Updated: {new Date(scorer.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

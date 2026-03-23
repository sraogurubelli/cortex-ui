// @ts-nocheck
/**
 * Enhanced Dataset Card Component
 *
 * Enhanced version using Canary UI components and design tokens.
 */

import { Card } from '@harnessio/ui/components';
import type { EvalsDatasetResponse } from '../api/types';

export interface DatasetCardEnhancedProps {
  dataset: EvalsDatasetResponse;
  onSelect?: (uuid: string) => void;
}

export function DatasetCardEnhanced({ dataset, onSelect }: DatasetCardEnhancedProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect?.(dataset.uuid)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(dataset.uuid)}
      tabIndex={0}
      role="article"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-1 truncate" style={{ color: 'var(--cn-text-default)' }}>
            {dataset.name}
          </h3>
          <p className="text-sm mb-2 font-mono truncate" style={{ color: 'var(--cn-text-subtle)' }}>
            {dataset.identifier}
          </p>
          {dataset.description && (
            <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--cn-text-muted)' }}>
              {dataset.description}
            </p>
          )}
        </div>
        {dataset.item_count != null && (
          <span className="inline-flex shrink-0 items-center rounded-md border border-[var(--cn-border-default)] px-2 py-0.5 text-xs font-medium text-[var(--cn-text-default)]">
            {dataset.item_count} items
          </span>
        )}
      </div>

      {(dataset.created_at || dataset.updated_at) && (
        <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid var(--cn-border-default)' }}>
          {dataset.created_at && (
            <div className="text-xs" style={{ color: 'var(--cn-text-subtle)' }}>
              Created: {new Date(dataset.created_at).toLocaleDateString()}
            </div>
          )}
          {dataset.updated_at && (
            <div className="text-xs" style={{ color: 'var(--cn-text-subtle)' }}>
              Updated: {new Date(dataset.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

import type { EvalsDatasetResponse } from '../api/types';

export interface DatasetCardProps {
  dataset: EvalsDatasetResponse;
  onSelect?: (uuid: string) => void;
}

export function DatasetCard({ dataset, onSelect }: DatasetCardProps) {
  return (
    <div
      role="article"
      className="evals-dataset-card border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect?.(dataset.uuid)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(dataset.uuid)}
      tabIndex={0}
    >
      <div className="font-medium text-gray-900">{dataset.name}</div>
      <div className="text-sm text-gray-500">{dataset.identifier}</div>
      {dataset.description && (
        <div className="text-sm text-gray-600 mt-1">{dataset.description}</div>
      )}
      {dataset.item_count != null && (
        <div className="text-xs text-gray-400 mt-1">{dataset.item_count} items</div>
      )}
    </div>
  );
}

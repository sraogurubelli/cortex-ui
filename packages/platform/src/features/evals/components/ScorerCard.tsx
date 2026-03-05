import type { ScorerResponse } from '../api/types';

export interface ScorerCardProps {
  scorer: ScorerResponse;
  onSelect?: (uuid: string) => void;
}

export function ScorerCard({ scorer, onSelect }: ScorerCardProps) {
  return (
    <div
      role="article"
      className="evals-scorer-card border rounded-lg p-4 hover:bg-gray-50"
      onClick={() => onSelect?.(scorer.uuid)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(scorer.uuid)}
      tabIndex={0}
    >
      <div className="font-medium text-gray-900">{scorer.name}</div>
      <div className="text-sm text-gray-500">{scorer.identifier}</div>
      <div className="text-xs text-gray-400 mt-1">Type: {scorer.type}</div>
      {scorer.description && (
        <div className="text-sm text-gray-600 mt-1">{scorer.description}</div>
      )}
    </div>
  );
}

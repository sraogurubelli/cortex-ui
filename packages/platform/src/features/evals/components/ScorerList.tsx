import { ScorerCard } from './ScorerCard';
import { useScorers } from '../hooks';
import type { ScorerResponse } from '../api/types';

export interface ScorerListProps {
  onSelectScorer?: (uuid: string) => void;
  page?: number;
  limit?: number;
}

export function ScorerList({
  onSelectScorer,
  page = 0,
  limit = 10,
}: ScorerListProps) {
  const { data, isLoading, error } = useScorers(page, limit);

  if (isLoading) return <div className="p-4 text-gray-500">Loading scorers...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {(error as Error).message}</div>;
  if (!data?.data?.length) return <div className="p-4 text-gray-500">No scorers yet.</div>;

  return (
    <div className="evals-scorer-list grid gap-3">
      {data.data.map((scorer: ScorerResponse) => (
        <ScorerCard
          key={scorer.uuid}
          scorer={scorer}
          onSelect={onSelectScorer}
        />
      ))}
    </div>
  );
}

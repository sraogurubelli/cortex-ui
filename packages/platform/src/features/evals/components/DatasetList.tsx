import { DatasetCard } from './DatasetCard';
import { useDatasets } from '../hooks';
import type { EvalsDatasetResponse } from '../api/types';

export interface DatasetListProps {
  onSelectDataset?: (uuid: string) => void;
  page?: number;
  limit?: number;
}

export function DatasetList({
  onSelectDataset,
  page = 0,
  limit = 10,
}: DatasetListProps) {
  const { data, isLoading, error } = useDatasets(page, limit);

  if (isLoading) return <div className="p-4 text-gray-500">Loading datasets...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {(error as Error).message}</div>;
  if (!data?.data?.length) return <div className="p-4 text-gray-500">No datasets yet.</div>;

  return (
    <div className="evals-dataset-list grid gap-3">
      {data.data.map((dataset: EvalsDatasetResponse) => (
        <DatasetCard
          key={dataset.uuid}
          dataset={dataset}
          onSelect={onSelectDataset}
        />
      ))}
    </div>
  );
}

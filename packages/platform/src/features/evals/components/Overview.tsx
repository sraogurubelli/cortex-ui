import { useDatasets, useScorers, useResults } from '../hooks';

export function EvalsOverview() {
  const { data: datasets } = useDatasets(0, 1);
  const { data: scorers } = useScorers(0, 1);
  const { data: runs } = useResults(0, 1);

  const datasetCount = datasets?.total_elements ?? 0;
  const scorerCount = scorers?.total_elements ?? 0;
  const runCount = runs?.total_elements ?? 0;

  return (
    <div className="evals-overview p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Evals Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="text-sm text-gray-500">Datasets</div>
          <div className="text-2xl font-semibold text-gray-900">{datasetCount}</div>
        </div>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="text-sm text-gray-500">Scorers</div>
          <div className="text-2xl font-semibold text-gray-900">{scorerCount}</div>
        </div>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="text-sm text-gray-500">Runs</div>
          <div className="text-2xl font-semibold text-gray-900">{runCount}</div>
        </div>
      </div>
    </div>
  );
}

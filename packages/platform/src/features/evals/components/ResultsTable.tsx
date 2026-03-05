import { useResults } from '../hooks';
import type { RunResponse } from '../api/types';

export interface ResultsTableProps {
  page?: number;
  limit?: number;
}

export function ResultsTable({ page = 0, limit = 10 }: ResultsTableProps) {
  const { data, isLoading, error } = useResults(page, limit);

  if (isLoading) return <div className="p-4 text-gray-500">Loading results...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {(error as Error).message}</div>;
  if (!data?.data?.length) return <div className="p-4 text-gray-500">No runs yet.</div>;

  return (
    <div className="evals-results-table overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Run ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Success</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Started</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.data.map((run: RunResponse) => (
            <tr key={run.run_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-900 font-mono">{run.run_id.slice(0, 8)}…</td>
              <td className="px-4 py-2 text-sm text-gray-700">{run.name ?? '—'}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{run.status}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{run.total_items ?? '—'}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{run.success_count ?? '—'}</td>
              <td className="px-4 py-2 text-sm text-gray-500">{run.started_at ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

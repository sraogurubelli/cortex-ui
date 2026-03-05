import { useParams, useNavigate } from 'react-router-dom';
import { useDataset, useDatasetItems } from '../hooks';

export function DatasetDetail() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();
  const { data: dataset, isLoading: loadingDataset, error: errorDataset } = useDataset(datasetId ?? null);
  const { data: itemsData, isLoading: loadingItems } = useDatasetItems(datasetId ?? null, 0, 100);

  if (loadingDataset || !datasetId) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }
  if (errorDataset) {
    return <div className="p-4 text-red-600">Error: {(errorDataset as Error).message}</div>;
  }
  if (!dataset) {
    return <div className="p-4 text-gray-500">Dataset not found.</div>;
  }

  const items = itemsData?.data ?? [];
  const loading = loadingItems;

  return (
    <div className="evals-dataset-detail p-4">
      <button
        type="button"
        className="text-sm text-blue-600 hover:underline mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h2 className="text-lg font-semibold text-gray-900">{dataset.name}</h2>
      <p className="text-sm text-gray-500">{dataset.identifier}</p>
      {dataset.description && (
        <p className="text-sm text-gray-600 mt-1">{dataset.description}</p>
      )}
      <h3 className="text-md font-medium text-gray-700 mt-4">Items</h3>
      {loading ? (
        <div className="text-sm text-gray-500">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">No items.</div>
      ) : (
        <ul className="mt-2 border rounded divide-y">
          {items.map((item) => (
            <li key={item.uuid} className="px-3 py-2 text-sm text-gray-700">
              <span className="font-mono text-gray-500">{item.uuid.slice(0, 8)}…</span>
              {item.input && (
                <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(item.input)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

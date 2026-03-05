import { useNavigate } from 'react-router-dom';
import { DatasetList } from '@cortex/platform';

export default function DatasetsPage() {
  const navigate = useNavigate();
  return (
    <DatasetList onSelectDataset={(id) => navigate(`/datasets/${id}`)} />
  );
}

import { useNavigate } from 'react-router-dom';
import { DatasetList } from './components/DatasetList';

export interface EvalsDatasetsPageProps {
  pathPrefix: string;
}

/**
 * Datasets list page for use inside the host; navigates to pathPrefix/datasets/:id.
 */
export function EvalsDatasetsPage({ pathPrefix }: EvalsDatasetsPageProps) {
  const navigate = useNavigate();
  return (
    <DatasetList
      onSelectDataset={(id) => navigate(`${pathPrefix}/datasets/${id}`)}
    />
  );
}

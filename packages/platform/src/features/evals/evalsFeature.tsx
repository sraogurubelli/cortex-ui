import type { HostFeature } from '../../host/types';
import { OverviewPage } from './pages/OverviewPage';
import { DatasetDetail } from './components/DatasetDetail';
import { ScorerList } from './components/ScorerList';
import { ResultsTable } from './components/ResultsTable';
import { EvalsDatasetsPage } from './EvalsDatasetsPage';

/**
 * Evals feature descriptor for host registration.
 * Pass the path prefix the host uses for evals (e.g. '/evals').
 */
export function getEvalsFeature(pathPrefix: string): HostFeature {
  const P = pathPrefix.replace(/\/$/, '');
  return {
    id: 'evals',
    sectionLabel: 'AI Evals',
    navItems: [
      { path: `${P}/overview`, label: 'Overview', icon: 'layout-dashboard' },
      { path: `${P}/datasets`, label: 'Datasets', icon: 'database' },
      { path: `${P}/scorers`, label: 'Scorers', icon: 'calculator' },
      { path: `${P}/results`, label: 'Results', icon: 'chart-bar' },
    ],
    routes: [
      { path: `${P}/overview`, element: <OverviewPage /> },
      { path: `${P}/datasets`, element: <EvalsDatasetsPage pathPrefix={P} /> },
      { path: `${P}/datasets/:datasetId`, element: <DatasetDetail /> },
      { path: `${P}/scorers`, element: <ScorerList /> },
      { path: `${P}/results`, element: <ResultsTable /> },
    ],
  };
}

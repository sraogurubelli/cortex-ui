import type { HostFeature } from '../../host/types';
import { EvalsOverview } from './components/Overview';
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
      { path: `${P}/overview`, label: 'Overview' },
      { path: `${P}/datasets`, label: 'Datasets' },
      { path: `${P}/scorers`, label: 'Scorers' },
      { path: `${P}/results`, label: 'Results' },
    ],
    routes: [
      { path: `${P}/overview`, element: <EvalsOverview /> },
      { path: `${P}/datasets`, element: <EvalsDatasetsPage pathPrefix={P} /> },
      { path: `${P}/datasets/:datasetId`, element: <DatasetDetail /> },
      { path: `${P}/scorers`, element: <ScorerList /> },
      { path: `${P}/results`, element: <ResultsTable /> },
    ],
  };
}

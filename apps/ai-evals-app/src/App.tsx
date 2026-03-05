import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EvalsOverview, DatasetDetail, ScorerList, ResultsTable } from '@cortex/platform';
import Layout from './components/Layout';
import DatasetsPage from './pages/DatasetsPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<EvalsOverview />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/datasets/:datasetId" element={<DatasetDetail />} />
          <Route path="/scorers" element={<ScorerList />} />
          <Route path="/results" element={<ResultsTable />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AgentsPage from './pages/AgentsPage';
import AgentDetailPage from './pages/AgentDetailPage';
import EvaluationsPage from './pages/EvaluationsPage';
import EvaluationDetailPage from './pages/EvaluationDetailPage';
import ConversationsPage from './pages/ConversationsPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<AgentsPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/evaluations" element={<EvaluationsPage />} />
          <Route path="/evaluations/:id" element={<EvaluationDetailPage />} />
          <Route path="/conversations" element={<ConversationsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

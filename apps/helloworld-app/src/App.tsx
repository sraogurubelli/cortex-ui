import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import AgentsPage from './pages/AgentsPage';
import AgentDetailPage from './pages/AgentDetailPage';
import EvaluationsPage from './pages/EvaluationsPage';
import EvaluationDetailPage from './pages/EvaluationDetailPage';
import ConversationsPage from './pages/ConversationsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="agents/:id" element={<AgentDetailPage />} />
          <Route path="evaluations" element={<EvaluationsPage />} />
          <Route path="evaluations/:id" element={<EvaluationDetailPage />} />
          <Route path="conversations" element={<ConversationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

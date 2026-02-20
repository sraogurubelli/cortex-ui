import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChatComponentsPage from './pages/ChatComponentsPage';
import AgentComponentsPage from './pages/AgentComponentsPage';
import EvaluationComponentsPage from './pages/EvaluationComponentsPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatComponentsPage />} />
          <Route path="/agents" element={<AgentComponentsPage />} />
          <Route path="/evaluation" element={<EvaluationComponentsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  AuthProvider,
  ProtectedRoute,
  ThemeProvider,
  NotificationProvider,
  AccountProvider,
  ProjectProvider,
} from '@cortex/core';
import type { HostFeature } from '@cortex/platform';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import { remotes } from './remotes.config';
import { loadAllRemotes } from './utils/remoteLoader';
import {
  getChatFeature,
  getProjectFeature,
  getAccountFeature,
  getDocumentsFeature,
  getPromptsFeature,
  getAgentsFeature,
  getModelsFeature,
  getSkillsFeature,
  getObservabilityFeature,
  getMemoryFeature,
  getEvalsFeature,
} from '@cortex/platform';

function AppContent() {
  const [features, setFeatures] = useState<HostFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatures() {
      try {
        // Try to load remote features first
        const remoteFeatures = await loadAllRemotes(remotes);

        // Core platform features
        const platformFeatures = [
          getChatFeature('/chat'),
          getDocumentsFeature('/documents'),
          getPromptsFeature('/prompts'),
          getAgentsFeature('/agents'),
          getModelsFeature('/models'),
          getSkillsFeature('/skills'),
          getObservabilityFeature('/observability'),
          getMemoryFeature('/memory'),
          getEvalsFeature('/evals'),
          getProjectFeature('/projects'),
          getAccountFeature('/account'),
        ];

        // Combine platform features with remote features, deduplicating by id
        const seenIds = new Set(platformFeatures.map(f => f.id));
        const uniqueRemotes = remoteFeatures.filter(f => !seenIds.has(f.id));
        const allFeatures = [...platformFeatures, ...uniqueRemotes];

        setFeatures(allFeatures);
      } catch (error) {
        console.error('[App] Error loading features:', error);
        // Fallback to local platform features on error
        setFeatures([
          getChatFeature('/chat'),
          getDocumentsFeature('/documents'),
          getPromptsFeature('/prompts'),
          getAgentsFeature('/agents'),
          getModelsFeature('/models'),
          getSkillsFeature('/skills'),
          getObservabilityFeature('/observability'),
          getMemoryFeature('/memory'),
          getEvalsFeature('/evals'),
          getProjectFeature('/projects'),
          getAccountFeature('/account'),
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadFeatures();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cn-bg-background-1">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cn-brand-primary mx-auto mb-4"></div>
          <p className="text-cn-text-foreground-2">Loading platform...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SignInPage />} />

      {/* Protected Routes */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout features={features}>
              <Routes>
                <Route path="/" element={<LandingPage features={features} />} />
                {features.flatMap(feature =>
                  feature.routes.map(r => (
                    <Route key={`${feature.id}-${r.path}`} path={r.path} element={r.element} />
                  ))
                )}
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AccountProvider>
              <ProjectProvider>
                <AppContent />
              </ProjectProvider>
            </AccountProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

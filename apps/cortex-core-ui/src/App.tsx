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
import SignUpPage from './pages/SignUpPage';
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

// Mock API interceptor for development (prevents 500 errors)
if (import.meta.env.DEV) {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    // Mock evals API endpoints
    if (url.includes('/evals/api/')) {
      return new Response(JSON.stringify({ items: [], total: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Pass through other requests
    return originalFetch(input, init);
  };
}

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
      <Route path="/signup" element={<SignUpPage />} />

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
  // Mock login function for development (bypasses backend API)
  const handleMockLogin = async (credentials: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock user data
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        name: credentials.email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.email.split('@')[0])}&background=random`,
      },
    };
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider onLogin={handleMockLogin}>
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

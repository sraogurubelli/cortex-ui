import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { HostFeature } from '@cortex/platform';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import { remotes } from './remotes.config';
import { loadAllRemotes } from './utils/remoteLoader';
import { getEvalsFeature } from '@cortex/platform';

function App() {
  const [features, setFeatures] = useState<HostFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatures() {
      try {
        // Try to load remote features first
        const remoteFeatures = await loadAllRemotes(remotes);

        // Fallback: if no remotes loaded, use local features
        const allFeatures =
          remoteFeatures.length > 0
            ? remoteFeatures
            : [getEvalsFeature('/evals')]; // Fallback to local import

        setFeatures(allFeatures);
      } catch (error) {
        console.error('[App] Error loading features:', error);
        // Fallback to local features on error
        setFeatures([getEvalsFeature('/evals')]);
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
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="*"
          element={
            <Layout features={features}>
              <Routes>
                <Route path="/" element={<LandingPage features={features} />} />
                {features.flatMap((feature) =>
                  feature.routes.map((r) => (
                    <Route key={`${feature.id}-${r.path}`} path={r.path} element={r.element} />
                  ))
                )}
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

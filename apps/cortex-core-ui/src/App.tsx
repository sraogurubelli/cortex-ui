import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import { registeredFeatures } from './features';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="*"
          element={
            <Layout features={registeredFeatures}>
              <Routes>
                <Route path="/" element={<LandingPage features={registeredFeatures} />} />
                {registeredFeatures.flatMap((feature) =>
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

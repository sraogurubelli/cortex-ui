import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const nav = [
    { path: '/overview', label: 'Overview' },
    { path: '/datasets', label: 'Datasets' },
    { path: '/scorers', label: 'Scorers' },
    { path: '/results', label: 'Results' },
  ];
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 200, borderRight: '1px solid #eee', padding: 16 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>AI Evals</h2>
        <nav>
          {nav.map(({ path, label }) => (
            <div key={path}>
              <Link
                to={path}
                style={{
                  display: 'block',
                  padding: '8px 0',
                  color: location.pathname.startsWith(path) ? '#2563eb' : undefined,
                  fontWeight: location.pathname.startsWith(path) ? 600 : undefined,
                }}
              >
                {label}
              </Link>
            </div>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
}

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/chat', label: 'Chat Components' },
    { path: '/agents', label: 'Agent Components' },
    { path: '/evaluation', label: 'Evaluation Components' },
  ];

  return (
    <div className="layout">
      <nav className="layout-nav">
        <div className="layout-nav-container">
          <div className="layout-nav-content">
            <div className="layout-nav-brand">
              <Link to="/" className="layout-nav-logo">
                Cortex UI
              </Link>
            </div>
            <div className="layout-nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`layout-nav-link ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}

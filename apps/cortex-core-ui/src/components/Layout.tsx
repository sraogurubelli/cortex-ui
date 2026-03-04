import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { HostFeature } from '@cortex/platform';

interface LayoutProps {
  children: React.ReactNode;
  features: HostFeature[];
}

const PROJECTS = ['My Project']; // TODO: from context/API

export default function Layout({ children, features }: LayoutProps) {
  const location = useLocation();
  const [projectOpen, setProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = PROJECTS.filter((p) =>
    p.toLowerCase().includes(search.trim().toLowerCase())
  );

  useEffect(() => {
    if (!projectOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProjectOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [projectOpen]);

  return (
    <div className="shell">
      <header className="shell__header">
        <h1 className="shell__header-title">Cortex</h1>
        <Link to="/signin" className="shell__header-link">Sign in</Link>
      </header>
      <div className="shell__body">
        <aside className="shell__sidebar">
          <div className="shell__project" ref={dropdownRef}>
            <span className="shell__project-label">Project</span>
            <button
              type="button"
              className="shell__project-switcher"
              aria-haspopup="listbox"
              aria-expanded={projectOpen}
              onClick={() => setProjectOpen((o) => !o)}
            >
              <span className="shell__project-name">{selectedProject}</span>
              <span className={`shell__project-chevron ${projectOpen ? 'shell__project-chevron--open' : ''}`} aria-hidden>▼</span>
            </button>
            {projectOpen && (
              <div className="shell__project-dropdown">
                <div className="shell__project-search-wrap">
                  <span className="shell__project-search-icon" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </span>
                  <input
                    type="text"
                    className="shell__project-search"
                    placeholder="Find project"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                  <button type="button" className="shell__project-filter" aria-label="Filter">≡</button>
                </div>
                <div className="shell__project-list-label">Projects</div>
                <ul className="shell__project-list" role="listbox">
                  {filtered.length === 0 ? (
                    <li className="shell__project-empty">No projects found</li>
                  ) : filtered.map((name) => (
                    <li key={name}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={name === selectedProject}
                        className="shell__project-option"
                        onClick={() => {
                          setSelectedProject(name);
                          setProjectOpen(false);
                          setSearch('');
                        }}
                      >
                        <span className="shell__project-option-check">{name === selectedProject ? '✓' : ''}</span>
                        <span className="shell__project-option-name">{name}</span>
                        <span className="shell__project-option-arrow" aria-hidden>›</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="shell__project-create"
                  onClick={() => setProjectOpen(false)}
                >
                  <span className="shell__project-create-icon">+</span>
                  Create project
                </button>
              </div>
            )}
          </div>
          {features.map((feature) => (
            <div key={feature.id} className="shell__sidebar-section">
              <span className="shell__sidebar-label">{feature.sectionLabel}</span>
              <nav>
                {feature.navItems.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`shell__sidebar-link ${location.pathname.startsWith(path) ? 'active' : ''}`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </aside>
        <main className="shell__main">{children}</main>
      </div>
    </div>
  );
}

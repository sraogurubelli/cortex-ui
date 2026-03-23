import { useState, useRef, useEffect } from 'react';
import { Text } from '@harnessio/ui/components';
import type { Project } from './types';

export interface ProjectSwitcherProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onCreateProject?: () => void;
}

/**
 * ProjectSwitcher - Dropdown for switching between projects
 *
 * Features:
 * - Search/filter projects
 * - Select active project
 * - Create new project action
 */
export function ProjectSwitcher({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProject,
}: ProjectSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Text variant="heading-small" className="mb-1.5 px-1 uppercase cn-text-foreground-3">
        Project
      </Text>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-md border cn-border-border-1 cn-bg-background-1 px-3 py-2 text-sm font-medium cn-text-foreground-1 hover:cn-bg-background-3 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(o => !o)}
      >
        <span className="truncate">{selectedProject?.name || 'Select project'}</span>
        <span className={`ml-2 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 rounded-lg cn-bg-background-4 shadow-lg border cn-border-border-1 p-2 z-50">
          {/* Search */}
          <div className="mb-2 flex items-center gap-2 rounded-md cn-bg-background-2 px-3 py-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="cn-text-foreground-3"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-sm cn-text-foreground-1 placeholder:cn-text-foreground-3"
              placeholder="Find project"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Projects List */}
          <Text variant="heading-small" className="mb-1.5 px-2 uppercase cn-text-foreground-3">
            Projects
          </Text>
          <ul className="space-y-0.5" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm cn-text-foreground-3">No projects found</li>
            ) : (
              filtered.map(project => {
                const isSelected = project.id === selectedProject?.id;
                return (
                  <li key={project.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium cn-text-foreground-1 hover:cn-bg-background-3 transition-colors"
                      onClick={() => {
                        onSelectProject(project);
                        setIsOpen(false);
                        setSearch('');
                      }}
                    >
                      <span className="w-5 flex-shrink-0 mr-2 cn-text-success">
                        {isSelected ? '✓' : ''}
                      </span>
                      <span className="flex-1 truncate text-left">{project.name}</span>
                      <span className="ml-2 cn-text-foreground-3 text-xs">›</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {/* Create Project */}
          {onCreateProject && (
            <button
              type="button"
              className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium cn-text-foreground-2 hover:cn-bg-background-3 transition-colors"
              onClick={() => {
                onCreateProject();
                setIsOpen(false);
              }}
            >
              <span className="text-base font-semibold">+</span>
              Create project
            </button>
          )}
        </div>
      )}
    </div>
  );
}

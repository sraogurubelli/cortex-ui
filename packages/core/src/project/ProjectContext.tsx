import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Project } from './types';

const PROJECT_STORAGE_KEY = 'cortex_current_project';

export interface ProjectContextValue {
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void;
  setCurrentProject: (project: Project | null) => void;
  switchProject: (projectId: string) => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

interface ProjectProviderProps {
  children: React.ReactNode;
  initialProjects?: Project[];
  onProjectChange?: (project: Project | null) => void;
}

export function ProjectProvider({
  children,
  initialProjects = [],
  onProjectChange,
}: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(() => {
    // Try to restore last selected project from localStorage
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (stored) {
      const projectId = stored;
      const found = initialProjects.find(p => p.id === projectId);
      return found || null;
    }

    // Default to first project if available
    return initialProjects[0] || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Persist current project to localStorage
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem(PROJECT_STORAGE_KEY, currentProject.id);
    } else {
      localStorage.removeItem(PROJECT_STORAGE_KEY);
    }
  }, [currentProject]);

  // Call onProjectChange callback when project changes
  useEffect(() => {
    if (onProjectChange) {
      onProjectChange(currentProject);
    }
  }, [currentProject, onProjectChange]);

  const setCurrentProject = useCallback((project: Project | null) => {
    setCurrentProjectState(project);
  }, []);

  const switchProject = useCallback(
    (projectId: string) => {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProjectState(project);
      }
    },
    [projects]
  );

  // Auto-select first project if current becomes invalid
  useEffect(() => {
    if (!currentProject && projects.length > 0) {
      setCurrentProjectState(projects[0]);
    }

    // If current project is not in the list anymore, select first
    if (currentProject && !projects.find(p => p.id === currentProject.id)) {
      setCurrentProjectState(projects[0] || null);
    }
  }, [projects, currentProject]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setProjects,
        setCurrentProject,
        switchProject,
        isLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext(): ProjectContextValue {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}

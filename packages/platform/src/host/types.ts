import type { ReactNode } from 'react';

/**
 * Nav item for the host sidebar.
 */
export interface HostNavItem {
  path: string;
  label: string;
}

/**
 * Feature descriptor: registers a feature with the host.
 * Host builds sidebar sections and routes from this.
 */
export interface HostFeature {
  id: string;
  sectionLabel: string;
  navItems: HostNavItem[];
  routes: { path: string; element: ReactNode }[];
}

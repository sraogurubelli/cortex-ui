import type { IconV2NamesType } from '@harnessio/ui/components';

export interface ScopeItem {
  id: string;
  name: string;
  type: 'organization' | 'project';
  icon: IconV2NamesType;
  path?: string[];
  timestamp?: number;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  orgId: string;
  orgName?: string;
  description?: string;
}

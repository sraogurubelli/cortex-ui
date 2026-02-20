import { Sidebar } from '@harnessio/ui/components';
import { Outlet } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { PageErrorBoundary } from '../PageErrorBoundary';

export function AppShell() {
  return (
    <Sidebar.Provider className="bg-cn-0">
      <Sidebar.Root>
        <SidebarNav />
      </Sidebar.Root>
      <Sidebar.Inset className="flex flex-col min-h-screen">
        <main className="flex-1 p-cn-lg">
          <PageErrorBoundary>
            <Outlet />
          </PageErrorBoundary>
        </main>
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
}

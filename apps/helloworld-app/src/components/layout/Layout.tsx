import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout as HarnessLayout, Text } from '@harnessio/ui/components';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/agents', label: 'Agents' },
    { path: '/evaluations', label: 'Evaluations' },
    { path: '/conversations', label: 'Conversations' },
  ];

  return (
    <HarnessLayout.Vertical className="min-h-screen bg-cn-0">
      <nav className="bg-cn-1 border-b border-cn-border-1">
        <HarnessLayout.Horizontal justify="between" align="center" className="max-w-[1280px] mx-auto px-cn-md h-16">
          <Link to="/" className="no-underline">
            <Text variant="heading-small" color="foreground-1">
              Cortex UI Hello World
            </Text>
          </Link>
          <HarnessLayout.Horizontal gapX="sm">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`no-underline px-cn-md py-cn-sm text-cn-size-3 font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-cn-foreground-1 border-cn-brand-primary'
                      : 'text-cn-foreground-3 border-transparent hover:text-cn-foreground-2 hover:border-cn-border-2'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </HarnessLayout.Horizontal>
        </HarnessLayout.Horizontal>
      </nav>
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-cn-md py-cn-lg">
        {children}
      </main>
    </HarnessLayout.Vertical>
  );
}

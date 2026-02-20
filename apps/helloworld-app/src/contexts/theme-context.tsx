import { useEffect, useState, type ReactNode } from 'react';
import { ThemeProvider as UIThemeProvider } from '@harnessio/ui/context';
import type { FullTheme } from '@harnessio/ui/context';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: FullTheme;
}

export function ThemeProvider({ children, defaultTheme = 'dark-std-std' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<FullTheme>(defaultTheme);
  const isLightTheme = theme.includes('light');

  useEffect(() => {
    document.documentElement.className = theme;
    const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
    if (meta) {
      meta.content = isLightTheme ? 'light' : 'dark';
    } else {
      const m = document.createElement('meta');
      m.name = 'color-scheme';
      m.content = isLightTheme ? 'light' : 'dark';
      document.head.appendChild(m);
    }
  }, [theme, isLightTheme]);

  return (
    <UIThemeProvider theme={theme} setTheme={setThemeState} isLightTheme={isLightTheme}>
      {children}
    </UIThemeProvider>
  );
}

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

const evalsApiUrl = process.env.VITE_AI_EVALS_API_URL ?? 'http://localhost:9000';

/**
 * Base Vite configuration shared between dev and prod builds
 */
export const baseConfig = defineConfig({
  plugins: [
    react(),
    federation({
      name: 'cortex_shell',
      remotes: {
        evalsApp: 'http://localhost:5176/assets/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.3.1',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.30.3',
        },
      } as any, // Type definitions for vite-plugin-federation are incomplete
    }),
  ],
  resolve: {
    alias: {
      '@cortex/core': path.resolve(__dirname, '../../packages/core/src'),
      '@cortex/platform': path.resolve(__dirname, '../../packages/platform/src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5177,
    strictPort: true,
    proxy: {
      '/evals': {
        target: evalsApiUrl,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5177,
    strictPort: true,
  },
});

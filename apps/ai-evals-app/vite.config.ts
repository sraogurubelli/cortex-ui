import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

const evalsApiUrl = process.env.VITE_AI_EVALS_API_URL ?? 'http://localhost:9000';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'evalsApp',
      filename: 'remoteEntry.js',
      exposes: {
        './EvalsFeature': './src/remoteEntry.tsx',
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
    port: 5176,
    strictPort: true,
    proxy: {
      '/evals': {
        target: evalsApiUrl,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5176,
    strictPort: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});

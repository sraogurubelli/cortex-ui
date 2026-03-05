import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const evalsApiUrl = process.env.VITE_AI_EVALS_API_URL ?? 'http://localhost:9000';

export default defineConfig({
  plugins: [react()],
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
});

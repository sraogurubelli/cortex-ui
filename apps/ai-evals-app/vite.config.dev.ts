import { mergeConfig, defineConfig } from 'vite';
import { baseConfig } from './vite.config.base';

/**
 * Development-specific Vite configuration
 * Optimized for fast HMR and quick rebuilds
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    mode: 'development',
    build: {
      // Dev builds (if needed)
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      sourcemap: 'cheap-module-source-map' as any,
    },
  })
);

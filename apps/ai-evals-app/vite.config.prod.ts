import { mergeConfig, defineConfig } from 'vite';
import { baseConfig } from './vite.config.base';

/**
 * Production-specific Vite configuration
 * Optimized for bundle size, caching, and runtime performance
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    mode: 'production',
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: 'terser', // Enable minification for production
      cssCodeSplit: true, // Enable CSS code splitting for better caching
      sourcemap: true, // Full source maps for debugging production issues
      rollupOptions: {
        output: {
          // Manual chunk splitting for optimal caching
          manualChunks: {
            // React ecosystem
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // React Query
            'vendor-query': ['@tanstack/react-query'],
            // Harness UI library
            'vendor-ui': ['@harnessio/ui'],
          },
          // Add hash to chunk names for cache busting
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      terserOptions: {
        compress: {
          drop_console: false, // Keep console logs (can be set to true for production)
          drop_debugger: true,
        },
      },
    },
    // Add custom plugin for chunk load retry
    plugins: [
      {
        name: 'chunk-load-retry',
        transformIndexHtml(html) {
          // Inject chunk retry script into HTML
          return html.replace(
            '</head>',
            `
  <script>
    // Chunk load retry mechanism
    (function() {
      const maxRetries = 3;
      const retryDelay = 1000;
      const originalImport = window.__vitePreload || window.import;

      window.__vitePreload = window.import = function(url) {
        let retryCount = 0;

        function attemptLoad() {
          return originalImport(url).catch(error => {
            if (retryCount < maxRetries) {
              retryCount++;
              console.warn(\`Failed to load chunk: \${url}. Retrying (\${retryCount}/\${maxRetries})...\`);
              return new Promise(resolve => setTimeout(resolve, retryDelay * retryCount))
                .then(attemptLoad);
            }
            console.error(\`Failed to load chunk after \${maxRetries} attempts: \${url}\`);
            throw error;
          });
        }

        return attemptLoad();
      };
    })();
  </script>
</head>`
          );
        },
      },
    ],
  })
);

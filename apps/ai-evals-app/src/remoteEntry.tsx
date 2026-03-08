/**
 * Remote entry point for the AI Evals microfrontend.
 * This file exposes the feature descriptor that the shell app will consume.
 */

import { getEvalsFeature } from '@cortex/platform';

// Re-export the feature descriptor for the shell to consume
export { getEvalsFeature };

// Export a default for dynamic imports
export default {
  getEvalsFeature,
};

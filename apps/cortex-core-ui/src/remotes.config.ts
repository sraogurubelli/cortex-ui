/**
 * Configuration for remote microfrontend applications.
 * Add new remotes here to enable them in the shell.
 */

export interface RemoteConfig {
  /** Unique identifier for the remote */
  id: string;
  /** Display name for the remote app */
  name: string;
  /** URL to the remote entry file (can use env variables) */
  url: string;
  /** Module path to the feature descriptor function */
  module: string;
  /** Function name to call from the module */
  featureFunction: string;
  /** Path prefix for the feature routes */
  pathPrefix: string;
  /** Whether this remote is enabled */
  enabled: boolean;
}

/**
 * Registered remote microfrontend applications.
 * The shell will dynamically load these at runtime.
 */
export const remotes: RemoteConfig[] = [
  {
    id: 'evals',
    name: 'AI Evals',
    url: import.meta.env.VITE_EVALS_REMOTE_URL || 'http://localhost:5176/assets/remoteEntry.js',
    module: './EvalsFeature',
    featureFunction: 'getEvalsFeature',
    pathPrefix: '/evals',
    enabled: true,
  },
  // Add more remotes here as you build them
  // {
  //   id: 'connectors',
  //   name: 'Connectors',
  //   url: import.meta.env.VITE_CONNECTORS_REMOTE_URL || 'http://localhost:5175/assets/remoteEntry.js',
  //   module: './ConnectorsFeature',
  //   featureFunction: 'getConnectorsFeature',
  //   pathPrefix: '/connectors',
  //   enabled: true,
  // },
];

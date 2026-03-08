/**
 * Utility for dynamically loading remote microfrontend applications.
 */

import type { HostFeature } from '@cortex/platform';
import type { RemoteConfig } from '../remotes.config';

/**
 * Dynamically loads a remote module and extracts the feature descriptor.
 *
 * @param remote - Remote configuration
 * @returns Promise resolving to the HostFeature or null if loading fails
 */
export async function loadRemoteFeature(
  remote: RemoteConfig
): Promise<HostFeature | null> {
  if (!remote.enabled) {
    console.log(`[RemoteLoader] Remote "${remote.id}" is disabled, skipping`);
    return null;
  }

  try {
    console.log(`[RemoteLoader] Loading remote "${remote.id}" from ${remote.url}`);

    // For module federation, we need to dynamically import the remote
    // The remote name is defined in the vite.config.ts remotes configuration
    const remoteName = remote.id === 'evals' ? 'evalsApp' : remote.id;

    // Dynamic import of federated module
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const module = await import(/* @vite-ignore */ `${remoteName}/${remote.module}`) as any;

    // Extract the feature function
    const featureFunction = module[remote.featureFunction] || module.default?.[remote.featureFunction];

    if (!featureFunction || typeof featureFunction !== 'function') {
      console.error(
        `[RemoteLoader] Failed to load feature function "${remote.featureFunction}" from remote "${remote.id}"`
      );
      return null;
    }

    // Call the function with the path prefix to get the feature descriptor
    const feature: HostFeature = featureFunction(remote.pathPrefix);

    console.log(`[RemoteLoader] Successfully loaded remote "${remote.id}"`);
    return feature;
  } catch (error) {
    console.error(`[RemoteLoader] Error loading remote "${remote.id}":`, error);
    return null;
  }
}

/**
 * Loads all enabled remote features.
 *
 * @param remotes - Array of remote configurations
 * @returns Promise resolving to array of successfully loaded features
 */
export async function loadAllRemotes(
  remotes: RemoteConfig[]
): Promise<HostFeature[]> {
  console.log(`[RemoteLoader] Loading ${remotes.length} remotes...`);

  const results = await Promise.allSettled(
    remotes.map((remote) => loadRemoteFeature(remote))
  );

  const features = results
    .filter((result): result is PromiseFulfilledResult<HostFeature> =>
      result.status === 'fulfilled' && result.value !== null
    )
    .map((result) => result.value);

  console.log(`[RemoteLoader] Loaded ${features.length} features successfully`);
  return features;
}

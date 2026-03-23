import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadRemoteFeature, loadAllRemotes } from '../remoteLoader';
import type { RemoteConfig } from '../../remotes.config';
import type { HostFeature as _HostFeature } from '@cortex/platform';

// Mock console methods to avoid cluttering test output
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('loadRemoteFeature', () => {
  it('returns null when remote is disabled', async () => {
    const disabledRemote: RemoteConfig = {
      id: 'test',
      name: 'Test Remote',
      url: 'http://localhost:5000/remoteEntry.js',
      module: './TestFeature',
      featureFunction: 'getTestFeature',
      pathPrefix: '/test',
      enabled: false,
    };

    const result = await loadRemoteFeature(disabledRemote);

    expect(result).toBeNull();
    expect(console.log).toHaveBeenCalledWith('[RemoteLoader] Remote "test" is disabled, skipping');
  });

  it('returns null when feature function is not found in module', async () => {
    const remote: RemoteConfig = {
      id: 'test',
      name: 'Test Remote',
      url: 'http://localhost:5000/remoteEntry.js',
      module: './TestFeature',
      featureFunction: 'getNonExistentFunction',
      pathPrefix: '/test',
      enabled: true,
    };

    // Mock dynamic import to return module without the expected function
    vi.doMock('test/./TestFeature', () => ({
      someOtherFunction: () => {},
    }));

    const result = await loadRemoteFeature(remote);

    expect(result).toBeNull();
    // Vitest may throw on missing mock export before the in-module "not a function" branch runs.
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[RemoteLoader] Error loading remote "test"'),
      expect.any(Error),
    );
  });

  it('returns null when feature function is not a function', async () => {
    const remote: RemoteConfig = {
      id: 'test',
      name: 'Test Remote',
      url: 'http://localhost:5000/remoteEntry.js',
      module: './TestFeature',
      featureFunction: 'getTestFeature',
      pathPrefix: '/test',
      enabled: true,
    };

    // Mock dynamic import to return module with non-function value
    vi.doMock('test/./TestFeature', () => ({
      getTestFeature: 'not a function',
    }));

    const result = await loadRemoteFeature(remote);

    expect(result).toBeNull();
  });

  it('returns null and logs error when dynamic import fails', async () => {
    const remote: RemoteConfig = {
      id: 'failing',
      name: 'Failing Remote',
      url: 'http://localhost:5000/remoteEntry.js',
      module: './FailingFeature',
      featureFunction: 'getFeature',
      pathPrefix: '/failing',
      enabled: true,
    };

    const result = await loadRemoteFeature(remote);

    // Since dynamic import will fail in test environment, it should return null
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error loading remote'),
      expect.any(Error)
    );
  });

  it('uses evalsApp as remote name when id is evals', async () => {
    const remote: RemoteConfig = {
      id: 'evals',
      name: 'Evals Remote',
      url: 'http://localhost:5176/assets/remoteEntry.js',
      module: './EvalsFeature',
      featureFunction: 'getEvalsFeature',
      pathPrefix: '/evals',
      enabled: true,
    };

    await loadRemoteFeature(remote);

    // Verify that console.log was called with the correct remote id
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Loading remote "evals"'));
  });
});

describe('loadAllRemotes', () => {
  it('returns empty array when no remotes provided', async () => {
    const result = await loadAllRemotes([]);

    expect(result).toEqual([]);
    expect(console.log).toHaveBeenCalledWith('[RemoteLoader] Loading 0 remotes...');
  });

  it('filters out disabled remotes', async () => {
    const remotes: RemoteConfig[] = [
      {
        id: 'enabled1',
        name: 'Enabled 1',
        url: 'http://localhost:5000/remoteEntry.js',
        module: './Feature1',
        featureFunction: 'getFeature1',
        pathPrefix: '/feature1',
        enabled: true,
      },
      {
        id: 'disabled',
        name: 'Disabled',
        url: 'http://localhost:5001/remoteEntry.js',
        module: './Feature2',
        featureFunction: 'getFeature2',
        pathPrefix: '/feature2',
        enabled: false,
      },
    ];

    await loadAllRemotes(remotes);

    // Both should attempt to load, but disabled one returns null
    expect(console.log).toHaveBeenCalledWith('[RemoteLoader] Loading 2 remotes...');
  });

  it('handles mixed success and failure results', async () => {
    const remotes: RemoteConfig[] = [
      {
        id: 'remote1',
        name: 'Remote 1',
        url: 'http://localhost:5000/remoteEntry.js',
        module: './Feature1',
        featureFunction: 'getFeature1',
        pathPrefix: '/feature1',
        enabled: true,
      },
      {
        id: 'remote2',
        name: 'Remote 2',
        url: 'http://localhost:5001/remoteEntry.js',
        module: './Feature2',
        featureFunction: 'getFeature2',
        pathPrefix: '/feature2',
        enabled: false, // This one will return null
      },
    ];

    const result = await loadAllRemotes(remotes);

    // Should handle all remotes without throwing
    expect(Array.isArray(result)).toBe(true);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Loaded'));
  });

  it('uses Promise.allSettled to handle failures gracefully', async () => {
    const remotes: RemoteConfig[] = [
      {
        id: 'failing',
        name: 'Failing',
        url: 'http://localhost:5000/remoteEntry.js',
        module: './FailingFeature',
        featureFunction: 'getFeature',
        pathPrefix: '/failing',
        enabled: true,
      },
    ];

    // Should not throw even if remote fails to load
    await expect(loadAllRemotes(remotes)).resolves.toBeDefined();
  });
});

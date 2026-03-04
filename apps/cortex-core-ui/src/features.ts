import { getEvalsFeature } from '@cortex/platform';
import type { HostFeature } from '@cortex/platform';

/**
 * Features registered with the host. Add new features here;
 * the host will render their nav and routes automatically.
 */
export const registeredFeatures: HostFeature[] = [
  getEvalsFeature('/evals'),
  // e.g. getConnectorsFeature('/connectors'),
  // getAgentsFeature('/agents'),
];

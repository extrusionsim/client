/**
 * EIS API Client v1
 *
 * Version 1 of the EIS API client. This module provides the main entry point
 * for the v1 API interface.
 */

import { EisClient, EisApiError } from './client.js';
import type {
  EisClientConfig,
  SimulationInput,
  SimulationOutput,
  RecipeSurface,
  RecipeTemper,
  PressBilletType,
  PressTechnology,
  DrawingDieType,
  DrawingDieComplexity,
  AlloyType,
} from './types/index.js';

// Internal utilities no longer exported

/**
 * EIS API Client v1
 *
 * Main class for interacting with version 1 of the EIS Simulation API.
 *
 * @example
 * ```typescript
 * import { v1 } from '@your-org/eis-api-client';
 *
 * const eisApi = new v1.Eis({
 *   customerName: 'your-customer-name',
 *   apiSecret: 'your-api-secret',
 * });
 *
 * const status = await eisApi.getApiStatus();
 * const result = await eisApi.calculateSimulation(inputData);
 * ```
 */
export class Eis extends EisClient {
  /**
   * API version identifier
   */
  public static readonly VERSION = '1.0.0';
}

/**
 * EIS API Error class for v1
 */
export { EisApiError as EisError };

/**
 * Type exports for v1 API
 */
export type {
  EisClientConfig,
  SimulationInput,
  SimulationOutput,
  RecipeSurface,
  RecipeTemper,
  PressBilletType,
  PressTechnology,
  DrawingDieType,
  DrawingDieComplexity,
  AlloyType,
};

/**
 * Utility function to create a new EIS client instance
 *
 * @param config - Configuration options for the client
 * @returns New EIS client instance
 */
export function createClient(config: EisClientConfig): Eis {
  return new Eis(config);
}

/**
 * Default export for CommonJS compatibility
 */
export default {
  EisError: EisApiError,
  createClient,
};

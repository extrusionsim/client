/**
 * EIS API Client Library
 *
 * Official TypeScript/JavaScript client library for the EIS Simulation API.
 * Provides type-safe access to aluminum extrusion simulation calculations.
 *
 * @example
 * ```typescript
 * import { Eis, SimulationInput, SimulationOutput } from '@extrusionsim/client';
 *
 * const client = new Eis({
 *   customerName: 'your-customer-name',
 *   apiSecret: 'your-api-secret',
 * });
 *
 * // Check API status
 * const status = await client.getApiStatus();
 * console.log('API Status:', status);
 *
 * // Run simulation
 * const result = await client.calculateSimulation({
 *   // ... simulation parameters
 * });
 * console.log('Simulation Result:', result);
 * ```
 *
 * @packageDocumentation
 */

import { EisApiError, EisClient } from "./client.js";
import * as v1Module from "./v1.js";

/**
 * EIS API Client
 *
 * Main class for interacting with the EIS Simulation API.
 */
export class Eis extends EisClient {}

/**
 * Version 1 API namespace for backward compatibility
 */
export const v1 = v1Module;

/**
 * EIS API Error class
 */
export { EisApiError as EisError };

/**
 * Type exports - Essential types for using the API
 */
export type {
	AgingTableOutput,
	AlloyType,
	DrawingDieComplexity,
	DrawingDieType,
	EisClientConfig,
	PressBilletType,
	PressTechnology,
	RecipeSurface,
	RecipeTemper,
	SimulationInput,
	SimulationOutput,
} from "./types/index.js";

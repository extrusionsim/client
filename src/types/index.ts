/**
 * EIS API Client Types
 *
 * These types define the structure of data used by the EIS Simulation API.
 * Do not modify these types unless the API specification changes.
 */

/**
 * Configuration options for initializing the EIS API client
 */
export interface EisClientConfig {
  /** Customer name for authentication */
  readonly customerName: string;
  /** API secret key for authentication */
  readonly apiSecret: string;
  /** Base URL of the EIS API (optional, defaults to production URL) */
  readonly baseUrl?: string;
  /** Request timeout in milliseconds (optional, defaults to 30000) */
  readonly timeout?: number;
}

/**
 * Surface finish options for the aluminum profile
 */
export type RecipeSurface =
  | 'BRIGHT_ANODIZED'
  | 'ANODIZED'
  | 'POWDER_COATED'
  | 'MILL_FINISH';

/**
 * Temper designation for aluminum alloy
 */
export type RecipeTemper = 'T4' | 'T5' | 'T6' | 'T66' | 'T65' | 'T64' | 'T54';

/**
 * Billet type for the extrusion process
 */
export type PressBilletType = 'CUT' | 'SHEARED';

/**
 * Press technology type
 */
export type PressTechnology = 'DIRECT' | 'INDIRECT';

/**
 * Die type classification
 */
export type DrawingDieType = 'FLAT' | 'PORTHOLE';

/**
 * Die complexity classification
 */
export type DrawingDieComplexity = 'A' | 'B' | 'C' | 'D' | 'E';

/**
 * Aluminum alloy type classification
 */
export type AlloyType =
  | 'ALMGSI'
  | 'ALZNMG'
  | 'ALZNMGCU'
  | 'ALCUMG'
  | 'ALMG'
  | 'ALMN'
  | 'CPAL';

/**
 * Input parameters for simulation calculation
 */
export interface SimulationInput {
	readonly recipeOrderVolume: number;
	readonly recipeFinalProductLength: number;
	readonly recipeStretcherScrap: number;
	readonly recipeRampUpTime: number;
	readonly recipeSurface: RecipeSurface;
	readonly recipeTemper: RecipeTemper;
	readonly recipeRealWeightPerMeter: number;
	readonly recipeLogLength: number;
	// recipeNrBilletsToStretch: number;
	readonly pressContainerDiameter: number;
	readonly pressBilletDiameter: number;
	readonly pressMaxShearableLength: number;
	readonly pressRunOutTableLength: number;
	readonly pressPullerPosition: number;
	readonly pressMinShearableLength: number;
	readonly pressBilletType: PressBilletType;
	readonly pressTechnology: PressTechnology;
	readonly pressForce: number;
	readonly pressMaxRamSpeed: number;
	readonly pressMaxPullerSpeed: number;
	readonly pressDeadCycleTime: number;
	readonly pressDieChangeTime: number;
	readonly pressBoreDiameter: number;
	readonly pressRodDiameter: number;
	readonly drawingArea: number;
	readonly drawingCircumference: number;
	readonly drawingThicknessMin: number;
	readonly drawingInsidePerimeter: number;
	readonly drawingOutsidePerimeter: number;
	readonly drawingMandrels: number;
	readonly drawingDieType: DrawingDieType;
	readonly drawingDieComplexity: DrawingDieComplexity;
	readonly dieCavities: number;
	readonly alloyType: AlloyType;
	readonly alloyTensileStrength: number;
	readonly alloyYieldStrength: number;
	readonly alloyCoolingRatio: number;
	readonly pressCostTotalPerHour: number;
	readonly dieAlVolume: number;
	readonly pressNitridingFactor: number;
	readonly pressId: string;
	readonly recipeId: string;

	// Quenching parameters (optional)
	readonly waterCapacityQuenching?: number;
	readonly airQuenchingCapacity?: number;
	readonly airLeadOutRunOutTableCapacity?: number;
	readonly quenchingLength?: number;
}

/**
 * Result of simulation calculation
 */
export interface SimulationOutput {
	readonly firstBilletLength: number;
	readonly normalBilletLength: number;
	readonly lastBilletLength: number;
	readonly billetsPerOrder: number;
	readonly extrusionLength: string;
	readonly lengthsPerBillet: number;
	readonly startUpRamSpeed: string;
	readonly normalRamSpeed: string;
	readonly normalProductSpeed: string;
	readonly billetsPerHour: string;
	readonly productivityPerHour: number;
	readonly netProductivityPerHour: number;
	readonly scrap: string;
	readonly timeToFinishOrder: number;
	readonly secondsByBillet: number;
	readonly firstBilletTemperature: number;
	readonly secondBilletTemperature: number;
	readonly normalBilletTemperature: number;
	readonly containerTemperature: number;
	readonly dieTemperatureAtThePress: number;
	readonly exitTemperaturePressMouth: number;
	readonly contactTime: number;
	readonly extrusionRatio: number;
	readonly inefficient: boolean;
	readonly efficiencyRatio: string;
	readonly totalOrderQuantity: string;
	readonly pressCostPerKg: string;
	readonly quantityStretching: number;
	// forceToStretchProfileTm: number;
	readonly stretchingPressureNeeded: number;
	readonly extrusionLengthAfterStretching: string;
	readonly nrBilletsToStretch: number;
	readonly weightPerMeter: number;
	readonly dieCavities: number;
	readonly contactTimeForNormalBillet: number;
	readonly customerLengthMm: number;
	readonly drawingThicknessMin: string;
	readonly theoreticalWeightPerMeter: number;
	readonly scrapAfterWeldingBillets: string;
	readonly totalCoringAndWeldingScrap: string;
	readonly dieLifeTime: number;
	readonly logBilletRestScrap: string;

	// Quenching output (optional)
	readonly quenchingSystemCapable: number;
	readonly waterFlowSetting: number;
	readonly airFlowSetting: number;
	readonly waterFlowAvailable: number;
	readonly pullerThroughQuenching: number;
	readonly temperatureProfileAfterQuenching: number;
	readonly coolingTime: number;
	readonly heatAluminumGoesOut: number;
	readonly qAlM: number;
	readonly qAlSc: number;
	readonly afterQuenchingCoolingRate: number;
	readonly tfalQuenching: number;
	readonly airWaterFlowRatio: number;
	readonly waterMass: number;
	readonly waterFlow: number;
	readonly airFlowEquivalent: number;
	readonly waterFlowSettingWaterFlowRatio: number;
	readonly airFlowSettingAirFlowRatio: number;
	readonly waterRequired: number;
	readonly airRequired: number;
	readonly sumAirWaterRatio: number;
	readonly shapeFactor: number;
}

/**
 * Result of aging table calculation
 */
export interface AgingTableEntry {
  readonly id: string;
  readonly alloy: string;
  readonly enDesignation: string;
  readonly product: string;
  readonly temper: string;
  readonly thickness: string;
  readonly tensileStrengthMin: string;
  readonly tensileStrengthMax: string;
  readonly yieldStrengthMin: string;
  readonly yieldStrengthMax: string;
  readonly elongationMin: string;
  readonly elongationMax: string;
  readonly eisDescription: string;
  readonly waitingTime: string;
  readonly preheatingTime: string;
  readonly soakingTime160: string;
  readonly soakingTime175: string;
  readonly soakingTime185: string;
  readonly soakingTime195: string;
  readonly leanAlloys: string;
}

export type AgingTableOutput = AgingTableEntry[];

/**
 * API status information
 */
export interface ApiStatus {
  readonly message: string;
  readonly timestamp: string;
  readonly version: string;
}


// type CustomerTier = "BASIC" | "FULL"
/**
 * Standard API response wrapper with conditional typing
 * Uses a different approach to make destructuring work
 */
export type ApiResponse<T> =
  | { readonly data: T; readonly success: true; readonly error: null,  }
  | { readonly data: null; readonly success: false; readonly error: string,  };

/**
 * Error response from the API
 */
export interface ApiError {
  readonly error: string;
  readonly timestamp?: string;
  readonly code?: string;
  readonly path?: string;
}

/**
 * HTTP client options for internal use
 */
export interface RequestOptions {
  readonly method: 'GET' | 'POST';
  readonly headers: Record<string, string>;
  readonly body?: string;
  readonly timeout: number;
}

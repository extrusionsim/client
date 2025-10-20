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
export type SimulationInput = {
	recipeOrderVolume: number;
	recipeFinalProductLength: number;
	recipeStretcherScrap: number;
	recipeRampUpTime: number;
	recipeSurface:
		| "BRIGHT_ANODIZED"
		| "ANODIZED"
		| "POWDER_COATED"
		| "MILL_FINISH";
	recipeTemper: "T4" | "T5" | "T6" | "T66" | "T65" | "T64" | "T54";
	recipeRealWeightPerMeter: number;
	recipeLogLength: number;
	// recipeNrBilletsToStretch: number;
	pressContainerDiameter: number;
	pressBilletDiameter: number;
	pressMaxShearableLength: number;
	pressRunOutTableLength: number;
	pressPullerPosition: number;
	pressMinShearableLength: number;
	pressBilletType: "CUT" | "SHEARED";
	pressTechnology: "DIRECT" | "INDIRECT";
	pressForce: number;
	pressMaxRamSpeed: number;
	pressMaxPullerSpeed: number;
	pressDeadCycleTime: number;
	pressDieChangeTime: number;
	pressBoreDiameter: number;
	pressRodDiameter: number;
	drawingArea: number;
	drawingCircumference: number;
	drawingThicknessMin: number;
	drawingInsidePerimeter: number;
	drawingOutsidePerimeter: number;
	drawingMandrels: number;
	drawingDieType: "FLAT" | "PORTHOLE";
	drawingDieComplexity: "A" | "B" | "C" | "D" | "E";
	dieCavities: number;
	alloyType:
		| "ALMGSI"
		| "ALZNMG"
		| "ALZNMGCU"
		| "ALCUMG"
		| "ALMG"
		| "ALMN"
		| "CPAL";
	alloyTensileStrength: number;
	alloyYieldStrength: number;
	pressCostTotalPerHour: number;
	dieAlVolume: number;
	pressNitridingFactor: number;
	pressId: string;
	recipeId: string;

	// Quenching parameters (optional)
	alloyCoolingRatio?: QuenchingInput["alloyCoolingRatio"];
	waterCapacityQuenching?: QuenchingInput["waterCapacityQuenching"];
	airQuenchingCapacity?: QuenchingInput["airQuenchingCapacity"];
	airLeadOutRunOutTableCapacity?: QuenchingInput["airLeadOutRunOutTableCapacity"];
	quenchingLength?: QuenchingInput["quenchingLength"];
};

/**
 * Result of simulation calculation
 */
export type SimulationOutput = {
	firstBilletLength: number;
	normalBilletLength: number;
	lastBilletLength: number;
	billetsPerOrder: number;
	extrusionLength: string;
	lengthsPerBillet: number;
	startUpRamSpeed: string;
	normalRamSpeed: string;
	normalProductSpeed: string;
	billetsPerHour: string;
	productivityPerHour: number;
	netProductivityPerHour: number;
	scrap: string;
	timeToFinishOrder: number;
	secondsByBillet: number;
	firstBilletTemperature: number;
	secondBilletTemperature: number;
	normalBilletTemperature: number;
	containerTemperature: number;
	dieTemperatureAtThePress: number;
	exitTemperaturePressMouth: number;
	contactTime: number;
	extrusionRatio: number;
	inefficient: boolean;
	efficiencyRatio: string;
	totalOrderQuantity: string;
	pressCostPerKg: string;
	quantityStretching: number;
	// forceToStretchProfileTm: number;
	stretchingPressureNeeded: number;
	extrusionLengthAfterStretching: string;
	nrBilletsToStretch: number;
	weightPerMeter: number;
	dieCavities: number;
	contactTimeForNormalBillet: number;
	customerLengthMm: number;
	drawingThicknessMin: string;
	theoreticalWeightPerMeter: number;
	scrapAfterWeldingBillets: string;
	totalCoringAndWeldingScrap: string;
	logBilletRestScrap: string;

	// Quenching output (optional)
	quenchingSystemCapable: number;
	waterFlowSetting: number;
	airFlowSetting: number;
	waterFlowAvailable: number;
	pullerThroughQuenching: number;
	temperatureProfileAfterQuenching: number;
	coolingTime: number;
	heatAluminumGoesOut: number;
	qAlM: number;
	qAlSc: number;
	afterQuenchingCoolingRate: number;
	tfalQuenching: number;
	airWaterFlowRatio: number;
	waterMass: number;
	waterFlow: number;
	airFlowEquivalent: number;
	waterFlowSettingWaterFlowRatio: number;
	airFlowSettingAirFlowRatio: number;
	waterRequired: number;
	airRequired: number;
	sumAirWaterRatio: number;
};
/**
 * Input parameters for quenching calculation
 */
type QuenchingInput = {
  readonly waterCapacityQuenching: number;
  readonly airQuenchingCapacity: number;
  readonly airLeadOutRunOutTableCapacity: number;
  readonly quenchingLength: number;
  readonly drawingThicknessMin: number;
  readonly customerLengthMm: number;
  readonly normalProductSpeed: number;
  readonly exitTemperaturePressMouth: number;
  readonly weightPerMeter: number;
  readonly dieCavities: number;
  readonly alloyCoolingRatio: number;
  readonly contactTimeForNormalBillet: number;
  readonly extrusionRatio: number;
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

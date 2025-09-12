/**
 * EIS API Client
 *
 * A TypeScript/JavaScript client for interacting with the EIS Simulation API.
 * Uses standard fetch API for maximum compatibility across environments.
 */

import type {
  EisClientConfig,
  SimulationInput,
  SimulationOutput,
  QuenchingInput,
  QuenchingOutput,
  AgingTableOutput,
  ApiStatus,
  ApiResponse,
  ApiError,
  RequestOptions,
} from './types/index.js';

/**
 * Custom error class for EIS API related errors
 */
export class EisApiError extends Error {
  public readonly code?: string;
  public readonly timestamp?: string;
  public readonly path?: string;
  public readonly statusCode?: number;

  constructor(
    message: string,
    options?: {
      code?: string;
      timestamp?: string;
      path?: string;
      statusCode?: number;
    }
  ) {
    super(message);
    this.name = 'EisApiError';

    if (options?.code !== undefined) {
      this.code = options.code;
    }
    if (options?.timestamp !== undefined) {
      this.timestamp = options.timestamp;
    }
    if (options?.path !== undefined) {
      this.path = options.path;
    }
    if (options?.statusCode !== undefined) {
      this.statusCode = options.statusCode;
    }
  }
}

/**
 * Internal configuration type with all properties required
 */
interface InternalConfig {
  readonly customerName: string;
  readonly apiSecret: string;
  readonly baseUrl: string;
  readonly timeout: number;
}

/**
 * Main EIS API Client class
 */
export class EisClient {
  private readonly config: InternalConfig;

  /**
   * Creates a new EIS API client instance
   *
   * @param config - Configuration options for the client
   */
  constructor(config: EisClientConfig) {
    if (!config.customerName) {
      throw new Error('customerName is required');
    }
    if (!config.apiSecret) {
      throw new Error('apiSecret is required');
    }

    this.config = {
      customerName: config.customerName,
      apiSecret: config.apiSecret,
      baseUrl: config.baseUrl ?? 'https://api.extrusionsim.com',
      timeout: config.timeout ?? 30000,
    };
  }

  /**
   * Makes an HTTP request to the EIS API
   *
   * @param endpoint - The API endpoint (without base URL)
   * @param options - Request options
   * @returns Promise with the response data
   */
  private async makeRequest<T>(
    endpoint: string,
    options: Partial<RequestOptions>
  ): Promise<T> {
    const url = `${this.config.baseUrl}/v1${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'EIS-Customer-Name': this.config.customerName,
      'EIS-API-Secret': this.config.apiSecret,
      ...options.headers,
    };

    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      ...(options.body && { body: options.body }),
    };

    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.config.timeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON error responses (like 429 rate limiting)
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData: ApiError | undefined;

        try {
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            errorData = (await response.json()) as ApiError;
            errorMessage = errorData.error || errorMessage;
          }
        } catch {
          // If we can't parse the error response, use the default message
        }

        throw new EisApiError(errorMessage, {
          ...(errorData?.code && { code: errorData.code }),
          ...(errorData?.timestamp && { timestamp: errorData.timestamp }),
          ...(errorData?.path && { path: errorData.path }),
          statusCode: response.status,
        });
      }

      const result = (await response.json()) as ApiResponse<T>;

      // Handle API-level errors (success: false)
      if (!result.success) {
        const errorMessage = result.error || 'Unknown API error';

        // Ensure validation errors are thrown as EisApiError
        if (errorMessage.startsWith('Validation error')) {
          throw new EisApiError(errorMessage, {
            code: 'VALIDATION_ERROR',
            statusCode: response.status,
          });
        }

        throw new EisApiError(errorMessage, {
          statusCode: response.status,
        });
      }

      if (result.data === null) {
        throw new EisApiError('API returned null data');
      }

      return result.data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle AbortError (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new EisApiError(`Request timeout after ${this.config.timeout}ms`);
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new EisApiError('Network error: Unable to connect to API');
      }

      // Re-throw EisApiError instances
      if (error instanceof EisApiError) {
        throw error;
      }

      // Handle other errors
      throw new EisApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * Calculate simulation based on input parameters
   *
   * @param inputData - SimulationInput object containing all required parameters:
   *     - `recipeOrderVolume: number` - Order volume for the recipe
   *     - `recipeFinalProductLength: number` - Final product length
   *     - `recipeStretcherScrap: number` - Stretcher scrap amount
   *     - `recipeRampUpTime: number` - Ramp up time for the recipe
   *     - `recipeSurface: 'BRIGHT_ANODIZED' | 'ANODIZED' | 'POWDER_COATED' | 'MILL_FINISH'` - Surface finish type
   *     - `recipeTemper: 'T4' | 'T5' | 'T6' | 'T66' | 'T65' | 'T64' | 'T54'` - Temper classification
   *     - `recipeRealWeightPerMeter: number` - Real weight per meter
   *     - `recipeLogLength: number` - Log length
   *     - `pressContainerDiameter: number` - Press container diameter
   *     - `pressBilletDiameter: number` - Press billet diameter
   *     - `pressMaxShearableLength: number` - Maximum shearable length
   *     - `pressRunOutTableLength: number` - Run out table length
   *     - `pressPullerPosition: number` - Puller position
   *     - `pressMinShearableLength: number` - Minimum shearable length
   *     - `pressBilletType: 'CUT' | 'SHEARED'` - Billet type
   *     - `pressTechnology: 'DIRECT' | 'INDIRECT'` - Press technology type
   *     - `pressForce: number` - Press force
   *     - `pressMaxRamSpeed: number` - Maximum ram speed
   *     - `pressMaxPullerSpeed: number` - Maximum puller speed
   *     - `pressDeadCycleTime: number` - Dead cycle time
   *     - `pressDieChangeTime: number` - Die change time
   *     - `pressBoreDiameter: number` - Press bore diameter
   *     - `pressRodDiameter: number` - Press rod diameter
   *     - `drawingArea: number` - Drawing area
   *     - `drawingCircumference: number` - Drawing circumference
   *     - `drawingThicknessMin: number` - Minimum drawing thickness
   *     - `drawingInsidePerimeter: number` - Inside perimeter
   *     - `drawingOutsidePerimeter: number` - Outside perimeter
   *     - `drawingMandrels: number` - Number of drawing mandrels
   *     - `drawingDieType: 'FLAT' | 'PORTHOLE'` - Die type
   *     - `drawingDieComplexity: 'A' | 'B' | 'C' | 'D' | 'E'` - Die complexity
   *     - `dieCavities: number` - Number of die cavities
   *     - `alloyType: 'ALMGSI' | 'ALZNMG' | 'ALZNMGCU'` - Alloy type
   *     - `alloyTensileStrength: number` - Alloy tensile strength
   *     - `alloyYieldStrength: number` - Alloy yield strength
   *     - `alloyCoolingRatio: number` - Alloy cooling ratio
   *     - `pressCostTotalPerHour: number` - Total press cost per hour
   *     - `dieAlVolume: number` - Die aluminum volume
   *     - `pressNitridingFactor: number` - Press nitriding factor
   *     - `pressId: string` - Press identifier
   *     - `recipeId: string` - Recipe identifier
   * @returns Promise<ApiResponse<SimulationOutput>> - API response with either:
   *   - Success: `{ data: SimulationOutput, success: true, error: null }` where SimulationOutput contains:
   *     - `firstBilletLength: number` - Length of the first billet
   *     - `normalBilletLength: number` - Length of normal billets
   *     - `lastBilletLength: number` - Length of the last billet
   *     - `billetsPerOrder: number` - Number of billets per order
   *     - `extrusionLength: string` - Total extrusion length
   *     - `lengthsPerBillet: number` - Number of lengths per billet
   *     - `startUpRamSpeed: string` - Startup ram speed
   *     - `normalRamSpeed: string` - Normal operating ram speed
   *     - `normalProductSpeed: string` - Normal product speed
   *     - `billetsPerHour: string` - Billets processed per hour
   *     - `productivityPerHour: number` - Productivity per hour
   *     - `netProductivityPerHour: number` - Net productivity per hour
   *     - `scrap: string` - Scrap amount
   *     - `timeToFinishOrder: number` - Time required to finish order
   *     - `secondsByBillet: number` - Seconds per billet
   *     - `firstBilletTemperature: number` - First billet temperature
   *     - `secondBilletTemperature: number` - Second billet temperature
   *     - `normalBilletTemperature: number` - Normal billet temperature
   *     - `containerTemperature: number` - Container temperature
   *     - `dieTemperatureAtThePress: number` - Die temperature at press
   *     - `exitTemperaturePressMouth: number` - Exit temperature at press mouth
   *     - `contactTime: number` - Contact time
   *     - `extrusionRatio: number` - Extrusion ratio
   *     - `inefficient: boolean` - Whether the process is inefficient
   *     - `efficiencyRatio: string` - Efficiency ratio
   *     - `totalOrderQuantity: string` - Total order quantity
   *     - `pressCostPerKg: string` - Press cost per kilogram
   *     - `quantityStretching: number` - Quantity for stretching
   *     - `stretchingPressureNeeded: number` - Pressure needed for stretching
   *     - `extrusionLengthAfterStretching: string` - Extrusion length after stretching
   *     - `nrBilletsToStretch: number` - Number of billets to stretch
   *     - `weightPerMeter: number` - Weight per meter
   *     - `dieCavities: number` - Number of die cavities
   *     - `contactTimeForNormalBillet: number` - Contact time for normal billet
   *     - `alloyCoolingRatio: string` - Alloy cooling ratio
   *     - `customerLengthMm: number` - Customer length in millimeters
   *     - `drawingThicknessMin: string` - Minimum drawing thickness
   *     - `theoreticalWeightPerMeter: number` - Theoretical weight per meter
   *     - `scrapAfterWeldingBillets: string` - Scrap after welding billets
   *     - `totalCoringAndWeldingScrap: string` - Total coring and welding scrap
   *     - `dieLifeTime: number` - Die lifetime
   *     - `logBilletRestScrap: string` - Log billet rest scrap
   *   - Error: `{ data: null, success: false, error: string }` - Contains error message
   */
  public async calculateSimulation(
    inputData: SimulationInput
  ): Promise<ApiResponse<SimulationOutput>> {
    if (!inputData) {
      return {
        data: null,
        success: false,
        error: 'inputData is required',
      } as const;
    }

    try {
      const data = await this.makeRequest<SimulationOutput>('/simulate', {
        method: 'POST',
        body: JSON.stringify(inputData),
      });

      return {
        data,
        success: true,
        error: null,
      } as const;
    } catch (error) {
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as const;
    }
  }

  public async calculateQuenching(
    inputData: QuenchingInput
  ): Promise<ApiResponse<QuenchingOutput>> {
    if (!inputData) {
      return {
        data: null,
        success: false,
        error: 'inputData is required',
      } as const;
    }

    try {
      const data = await this.makeRequest<QuenchingOutput>('/quenching', {
        method: 'POST',
        body: JSON.stringify(inputData),
      });

      return {
        data,
        success: true,
        error: null,
      } as const;
    } catch (error) {
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as const;
    }
  }

  public async getAgingTable(
    
  ): Promise<ApiResponse<AgingTableOutput>> {
    
    try {
      const data = await this.makeRequest<AgingTableOutput>('/aging-table', {
        method: 'GET',
      });

      return {
        data,
        success: true,
        error: null,
      } as const;
    } catch (error) {
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as const;
    }
  }

  /**
   * Get API status and health information
   *
   * @returns Promise<ApiResponse<ApiStatus>> - API response with either:
   *   - Success: `{ data: ApiStatus, success: true, error: null }` where ApiStatus contains:
   *     - `message: string` - Status message from the API
   *     - `timestamp: string` - Timestamp of the status check
   *     - `version: string` - API version information
   *   - Error: `{ data: null, success: false, error: string }` - Contains error message
   */
  public async getApiStatus(): Promise<ApiResponse<ApiStatus>> {
    try {
      const data = await this.makeRequest<ApiStatus>('/status', {
        method: 'GET',
      });

      return {
        data,
        success: true,
        error: null,
      } as const;
    } catch (error) {
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as const;
    }
  }

  /**
   * Get the current configuration (without sensitive data)
   *
   * @returns Configuration object with redacted sensitive information
   */
  public getConfig(): Omit<EisClientConfig, 'apiSecret'> & {
    apiSecret: string;
  } {
    return {
      customerName: this.config.customerName,
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      apiSecret: '[REDACTED]',
    };
  }
}

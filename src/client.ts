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
        throw new EisApiError(result.error || 'Unknown API error', {
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
   * @param inputData - Simulation input parameters
   * @returns Promise with API response containing simulation results
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

  /**
   * Get API status and health information
   *
   * @returns Promise with API response containing status information
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

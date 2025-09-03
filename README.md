# EIS API Client

[![npm version](https://badge.fury.io/js/%40extrusionsim%2Fclient.svg)](https://badge.fury.io/js/%40extrusionsim%2Fclient)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official TypeScript/JavaScript client library for the EIS Simulation API. This package provides type-safe access to aluminum extrusion simulation calculations with a simple, intuitive interface.

## Features

- 🎯 **Type-safe**: Full TypeScript support with comprehensive type definitions
- 🌐 **Framework-agnostic**: Works in Node.js, browsers, and any JavaScript environment
- 🚀 **Modern**: Uses native fetch API for maximum compatibility
- 🔒 **Secure**: Built-in authentication handling
- ⚡ **Efficient**: Optimized for performance with built-in error handling
- 📦 **Zero dependencies**: Lightweight package with no external dependencies

## Installation

```bash
npm install @extrusionsim/client
```

## Quick Start

```typescript
import { v1 } from '@extrusionsim/client';

// Create client instance
const eisApi = new v1.Eis({
  customerName: 'your-customer-name',
  apiSecret: 'your-api-secret',
});

// Check API status
const statusResponse = await eisApi.getApiStatus();
if (statusResponse.success) {
  console.log('API Status:', statusResponse.data.message);
} else {
  console.error('API Error:', statusResponse.error);
}

// Run simulation
const simulationResponse = await eisApi.calculateSimulation({
  // ... simulation parameters
});

if (simulationResponse.success) {
  console.log(
    'Simulation completed:',
    simulationResponse.data.productivityPerHour,
    'kg/h'
  );
} else {
  console.error('Simulation failed:', simulationResponse.error);
}
```

## API Reference

### Client Initialization

#### `new v1.Eis(config)`

Creates a new EIS API client instance.

**Parameters:**

- `config`: `EisClientConfig` - Configuration object

```typescript
interface EisClientConfig {
  customerName: string; // Your customer name
  apiSecret: string; // Your API secret key
  baseUrl?: string; // API base URL (optional)
  timeout?: number; // Request timeout in ms (optional, default: 30000)
}
```

**Example:**

```typescript
const eisApi = new v1.Eis({
  customerName: 'acme-corp',
  apiSecret: 'eis_abc123def456...',
  baseUrl: 'https://api.extrusionsim.com', // optional
  timeout: 60000, // optional, 60 seconds
});
```

### Methods

#### `getApiStatus(): Promise<ApiStatus>`

Retrieves the current API status and health information.

**Returns:** `Promise<ApiStatus>`

```typescript
interface ApiStatus {
  message: string; // Status message
  timestamp: string; // ISO timestamp
  version: string; // API version
}
```

**Example:**

```typescript
try {
  const status = await eisApi.getApiStatus();
  console.log('API is', status.message);
  console.log('Version:', status.version);
} catch (error) {
  console.error('API is unavailable:', error.message);
}
```

#### `calculateSimulation(input): Promise<SimulationOutput>`

Calculates aluminum extrusion simulation based on input parameters.

**Parameters:**

- `input`: `SimulationInput` - Simulation parameters

**Returns:** `Promise<SimulationOutput>`

The `SimulationInput` interface contains all the parameters needed for simulation:

```typescript
interface SimulationInput {
  // Recipe parameters
  recipeOrderVolume: number;
  recipeFinalProductLength: number;
  recipeStretcherScrap: number;
  recipeRampUpTime: number;
  recipeSurface:
    | 'BRIGHT_ANODIZED'
    | 'ANODIZED'
    | 'POWDER_COATED'
    | 'MILL_FINISH';
  recipeTemper: 'T4' | 'T5' | 'T6' | 'T66';
  recipeRealWeightPerMeter: number;

  // Press parameters
  pressContainerDiameter: number;
  pressBilletDiameter: number;
  pressMaxShearableLength: number;
  pressRunOutTableLength: number;
  // ... and many more (see full type definitions)
}
```

**Example:**

```typescript
const simulationResult = await eisApi.calculateSimulation({
  recipeOrderVolume: 1000,
  recipeFinalProductLength: 6000,
  recipeStretcherScrap: 100,
  recipeRampUpTime: 30,
  recipeSurface: 'MILL_FINISH',
  recipeTemper: 'T6',
  // ... other parameters
});

console.log('Productivity:', simulationResult.productivityPerHour, 'kg/h');
console.log('Efficiency:', simulationResult.efficiencyRatio + '%');
```

#### `getConfig(): Omit<EisClientConfig, 'apiSecret'> & { apiSecret: string }`

Returns the current client configuration with the API secret redacted for security.

**Example:**

```typescript
const config = eisApi.getConfig();
console.log(config);
// Output: { customerName: 'acme-corp', baseUrl: '...', timeout: 30000, apiSecret: '[REDACTED]' }
```

### Utility Functions

#### `v1.createClient(config): Eis`

Alternative way to create a client instance.

```typescript
const eisApi = v1.createClient({
  customerName: 'your-customer',
  apiSecret: 'your-secret',
});
```

## Error Handling

The client throws `EisApiError` instances for API-related errors:

```typescript
import { v1 } from '@extrusionsim/client';

try {
  await eisApi.getApiStatus();
} catch (error) {
  if (error instanceof v1.EisError) {
    console.error('EIS API Error:', error.message);
    console.error('HTTP Status:', error.statusCode);
    console.error('Error Code:', error.code);
    console.error('Timestamp:', error.timestamp);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Common Error Scenarios

- **401 Unauthorized**: Invalid credentials or inactive account
- **429 Rate Limited**: Too many requests, implement backoff
- **500 Server Error**: API server issue, retry later
- **Network Error**: Connection issues, check connectivity

## Advanced Usage

### Custom Configuration

```typescript
// Production configuration
const productionClient = new v1.Eis({
  customerName: 'your-customer',
  apiSecret: 'your-production-secret',
  baseUrl: 'https://api.eis.com',
  timeout: 30000,
});

// Staging configuration
const stagingClient = new v1.Eis({
  customerName: 'your-customer',
  apiSecret: 'your-staging-secret',
  baseUrl: 'https://staging.extrusionsim.com',
  timeout: 60000, // Longer timeout for staging
});
```

### Batch Processing

```typescript
const simulations = [input1, input2, input3];
const results = await Promise.all(
  simulations.map((input) => eisApi.calculateSimulation(input))
);
```

### Error Recovery with Retry

```typescript
async function simulateWithRetry(input: SimulationInput, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await eisApi.calculateSimulation(input);
    } catch (error) {
      if (error instanceof v1.EisError && error.statusCode === 429) {
        // Rate limited, wait before retry
        await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
        continue;
      }
      throw error; // Re-throw non-retryable errors
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Framework Integration

### Express.js

```typescript
import express from 'express';
import { v1 } from '@extrusionsim/client';

const app = express();
const eisApi = new v1.Eis({
  /* config */
});

app.post('/simulate', async (req, res) => {
  try {
    const result = await eisApi.calculateSimulation(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### React (Browser)

```typescript
import { v1 } from '@extrusionsim/client';

function useEisApi() {
  const eisApi = useMemo(
    () =>
      new v1.Eis({
        customerName: process.env.REACT_APP_EIS_CUSTOMER_NAME!,
        apiSecret: process.env.REACT_APP_EIS_API_SECRET!,
      }),
    []
  );

  return eisApi;
}
```

## Development

### Local Testing

```bash
# Build the project
npm run build

# Run tests
npm test

# Format code
npm run format

# Type check
npm run typecheck
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

## Support

- 📧 Email: info@extrusionsim.com
- 📝 Documentation: [https://docs.extrusionsim.com](https://docs.extrusionsim.com)
- 🐛 Issues: [GitHub Issues](https://github.com/extrusionsim/client/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.3

- Validation error handling integrated.

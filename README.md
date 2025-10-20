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

// Run simulation (optionally include quenching parameters)
const simulationResponse = await eisApi.calculateSimulation({
  // ... simulation parameters
  // Optional: add quenching parameters for integrated quenching calculations
});

if (simulationResponse.success) {
  console.log(
    'Simulation completed:',
    simulationResponse.data.productivityPerHour,
    'kg/h'
  );
  // Quenching results are included if quenching parameters were provided
} else {
  console.error('Simulation failed:', simulationResponse.error);
}

// Get aging table
const agingTableResponse = await eisApi.getAgingTable();

if (agingTableResponse.success) {
  console.log('Aging table entries:', agingTableResponse.data.length);
} else {
  console.error('Failed to get aging table:', agingTableResponse.error);
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

Calculates aluminum extrusion simulation based on input parameters. When optional quenching parameters are included in the input, the simulation output will also include quenching-related calculations.

**Parameters:**

- `input`: `SimulationInput` - Simulation parameters (including optional quenching parameters)

**Returns:** `Promise<SimulationOutput>` - Simulation results (including optional quenching results when quenching parameters are provided)

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
  recipeTemper: 'T4' | 'T5' | 'T6' | 'T66' | 'T65' | 'T64' | 'T54';
  recipeRealWeightPerMeter: number;
  recipeLogLength: number;

  // Press parameters
  pressContainerDiameter: number;
  pressBilletDiameter: number;
  pressMaxShearableLength: number;
  pressRunOutTableLength: number;
  pressBilletType: 'CUT' | 'SHEARED';
  pressTechnology: 'DIRECT' | 'INDIRECT';

  // Drawing parameters
  drawingDieType: 'FLAT' | 'PORTHOLE';
  drawingDieComplexity: 'A' | 'B' | 'C' | 'D' | 'E';

  // Alloy parameters
  alloyType:
    | 'ALMGSI'
    | 'ALZNMG'
    | 'ALZNMGCU'
    | 'ALCUMG'
    | 'ALMG'
    | 'ALMN'
    | 'CPAL';

  // Optional quenching parameters
  alloyCoolingRatio?: number;
  waterCapacityQuenching?: number;
  airQuenchingCapacity?: number;
  airLeadOutRunOutTableCapacity?: number;
  quenchingLength?: number;

  // ... see full type definitions in docs
}
```

The `SimulationOutput` interface contains comprehensive simulation results:

```typescript
interface SimulationOutput {
  // Basic output
  productivityPerHour: number;
  efficiencyRatio: string;
  timeToFinishOrder: number;

  // Billet information
  firstBilletLength: number;
  normalBilletLength: number;
  lastBilletLength: number;
  billetsPerOrder: number;

  // Temperature data
  firstBilletTemperature: number;
  exitTemperaturePressMouth: number;
  containerTemperature: number;

  // Optional quenching output (when quenching parameters are provided)
  quenchingSystemCapable?: number;
  waterFlowSetting?: number;
  airFlowSetting?: number;
  temperatureProfileAfterQuenching?: number;
  coolingTime?: number;
  afterQuenchingCoolingRate?: number;

  // ... see full type definitions in docs
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
  alloyType: 'ALMGSI',
  pressBilletType: 'CUT',
  pressTechnology: 'DIRECT',
  drawingDieType: 'FLAT',
  drawingDieComplexity: 'B',

  // Optional: Include quenching parameters for quenching calculations
  alloyCoolingRatio: 0.5,
  waterCapacityQuenching: 100,
  airQuenchingCapacity: 50,
  airLeadOutRunOutTableCapacity: 30,
  quenchingLength: 5000,
  // ... other parameters
});

console.log('Productivity:', simulationResult.productivityPerHour, 'kg/h');
console.log('Efficiency:', simulationResult.efficiencyRatio + '%');

// Access quenching results if quenching parameters were provided
if (simulationResult.quenchingSystemCapable !== undefined) {
  console.log('Quenching capable:', simulationResult.quenchingSystemCapable);
  console.log('Cooling time:', simulationResult.coolingTime, 's');
}
```

#### `getAgingTable(): Promise<AgingTableOutput>`

Retrieves the aging table data containing alloy specifications and heat treatment parameters.

**Returns:** `Promise<AgingTableOutput>`

The `AgingTableOutput` is an array of `AgingTableEntry` objects:

```typescript
interface AgingTableEntry {
  // ... see full type definitions in docs
}

type AgingTableOutput = AgingTableEntry[];
```

**Example:**

```typescript
const agingTableResult = await eisApi.getAgingTable();

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
  baseUrl: 'https://api.extrusionsim.com',
  timeout: 30000,
});
```

### Batch Processing

```typescript
const simulations = [input1, input2, input3];
const results = await Promise.all(
  simulations.map((input) => eisApi.calculateSimulation(input))
);
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

### v1.0.9

- Fixed type references.

### v1.0.8

- **Integrated quenching into simulation**: Quenching calculations are now integrated directly into the `calculateSimulation()` method. When optional quenching parameters (`alloyCoolingRatio`, `waterCapacityQuenching`, `airQuenchingCapacity`, `airLeadOutRunOutTableCapacity`, `quenchingLength`) are provided, the simulation output includes quenching results.
- **Expanded temper options**: Added support for additional temper designations including 'T66', 'T65', 'T64', and 'T54'.

### v1.0.7

- Integrated billet scrap.

### v1.0.6

- Updated readme file with comprehensive documentation.

### v1.0.5

- Fixed aging chart TypeScript type issues.

### v1.0.4

- **Aging table integrated**: Added `getAgingTable()` method for retrieving comprehensive alloy specifications and heat treatment parameters.

### v1.0.3

- Validation error handling integrated.

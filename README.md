# EIS API Client

[![npm version](https://badge.fury.io/js/%40extrusionsim%2Fclient.svg)](https://badge.fury.io/js/%40extrusionsim%2Fclient)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official TypeScript/JavaScript client library for the EIS Simulation API. This package provides type-safe access to aluminum extrusion simulation calculations with a simple, intuitive interface.

## Installation

```bash
npm install @extrusionsim/client
```

## API Reference

See [docs.extrusionsim.com](https://docs.extrusionsim.com) for complete API reference documentation.

## Support

- 📧 Email: info@extrusionsim.com
- 📝 Documentation: [https://docs.extrusionsim.com](https://docs.extrusionsim.com)
- 🐛 Issues: [GitHub Issues](https://github.com/extrusionsim/client/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.18
- Integrated precut billet length calculation.

### v1.0.13
- Integrated shape stability.
- **Integrated quenching into simulation**: Quenching calculations are now integrated directly into the `calculateSimulation()` method. When optional quenching parameters (`alloyCoolingRatio`, `waterCapacityQuenching`, `airQuenchingCapacity`, `airLeadOutRunOutTableCapacity`, `quenchingLength`) are provided, the simulation output includes quenching results.
- **Expanded temper options**: Added support for additional temper designations including 'T66', 'T65', 'T64', and 'T54'.
- Fixed type references.
- Improved error messages.


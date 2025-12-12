# Description

This PR improves API consistency, security, and type safety across the RGB wallet implementation. Key changes include:

- **API Consistency**: Standardized property naming to camelCase (`rgbNodeEndpoint`, `token`, `recipient`, `amount`, `feeRate`, etc.) while maintaining compatibility with underlying RGB SDK's snake_case requirements
- **Security Enhancements**: Added secure memory wiping using `sodium_memzero` for cryptographic keys in `dispose()` methods
- **Type Safety**: Fixed BIP32 version handling for different networks (mainnet/testnet/regtest) when deriving keys from extended private keys
- **Pagination Support**: Added `limit` and `skip` parameters to `getTransfers()` method for better transfer history management
- **Type Definitions**: Improved JSDoc type definitions with proper named types, exported `RgbTransactionReceipt` and `RgbTransferReceipt` types
- **Code Quality**: Refactored initialization logic, improved error handling, and updated tests to match new API

## Motivation and Context

The changes address several issues:
- Inconsistent property naming between public API (camelCase) and internal SDK calls (snake_case)
- Missing secure memory cleanup for sensitive cryptographic material
- Incorrect BIP32 version handling causing "Version mismatch" errors when using keys from different networks
- Lack of pagination support for transfer listings
- Missing or incomplete type definitions for better IDE support and type safety

## Related Issue

PR fixes the following issues:
- Secure key material cleanup in `dispose()` methods
- BIP32 version mismatch errors when using keys from different networks
- API consistency between camelCase public interface and snake_case SDK calls
- Missing pagination support for transfer queries

## Type of change

- [x] Bug fix (non-breaking change which fixes an issue)
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [x] This change requires a documentation update

## Changes Summary

### Security
- Added `sodium_memzero` for secure key wiping in `WalletManagerRgb.dispose()` and `WalletAccountRgb.dispose()`
- Properly nullify sensitive key material after zero-filling

### API Improvements
- Renamed `rgb_node_endpoint` → `rgbNodeEndpoint` (camelCase) in public API
- Updated `transfer()` to use camelCase properties: `token`, `recipient`, `amount`, `feeRate`, `minConfirmations`, `witnessData`
- Added `feeRate` field to `RgbTransaction` type
- Added pagination support to `getTransfers({ limit, skip, assetId })`

### Bug Fixes
- Fixed BIP32 version handling by using `BIP32_VERSIONS` from rgb-sdk based on network
- Fixed `keyPair` getter to use correct key assignments (`xpub`/`xpriv`)
- Fixed `getTransfers()` to request transfers without asset filter when `assetId` is not provided
- Updated `listAssets()` response handling to work with `{ nia, uda, cfa }` structure

### Type Definitions
- Exported `RgbTransactionReceipt` and `RgbTransferReceipt` types
- Defined proper named types for restore configs (`RgbRestoreConfig`, `RgbRestoreParams`)
- Improved `TransferOptions` type with better `witnessData` typing
- Added `GeneratedKeys` type annotation

### Documentation
- Updated README to use `https://rgb-node.test.thunderstack.org` as default endpoint
- Updated example code to reflect new camelCase API

### Tests
- Updated all tests to match new API signatures
- Added `BIP32_VERSIONS` to test mocks
- Fixed test expectations for new response structures


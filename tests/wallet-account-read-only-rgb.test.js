import { beforeAll, describe, expect, jest, test } from '@jest/globals'

// Mock rgb-sdk before importing anything that uses it
jest.unstable_mockModule('../src/libs/rgb-sdk.js', () => {
  const mockWalletManagerInstance = {
    getBtcBalance: jest.fn().mockResolvedValue({ vanilla: { settled: 1000000 } }),
    getAssetBalance: jest.fn().mockResolvedValue(500000),
    sendBtcBegin: jest.fn().mockResolvedValue('psbt-bytes'),
    signPsbt: jest.fn().mockResolvedValue('signed-psbt'),
    estimateFee: jest.fn().mockResolvedValue({ fee: 1000 }),
    estimateFeeRate: jest.fn().mockResolvedValue(1),
    sendBegin: jest.fn().mockResolvedValue('psbt-bytes')
  }

  return {
    WalletManager: jest.fn().mockImplementation(() => mockWalletManagerInstance)
  }
})

let WalletAccountReadOnlyRgb

beforeAll(async () => {
  const module = await import('../src/wallet-account-read-only-rgb.js')
  WalletAccountReadOnlyRgb = module.default
})

describe('WalletAccountReadOnlyRgb', () => {
  describe('constructor', () => {
    test('should create a read-only account with address', async () => {
      const account = new WalletAccountReadOnlyRgb('bc1p1234567890abcdefghijklmnopqrstuvwxyz', {})
      expect(account).toBeInstanceOf(WalletAccountReadOnlyRgb)
      expect(await account.getAddress()).toBe('bc1p1234567890abcdefghijklmnopqrstuvwxyz')
    })

    test('should create a read-only account with default config', () => {
      const defaultAccount = new WalletAccountReadOnlyRgb('bc1p...', {})
      expect(defaultAccount).toBeInstanceOf(WalletAccountReadOnlyRgb)
    })
  })

  describe('_initializeWallet validation', () => {
    test('should throw error if keys are not provided', async () => {
      const accountWithoutKeys = new WalletAccountReadOnlyRgb('bc1p...', {})
      await expect(accountWithoutKeys.getBalance()).rejects.toThrow('Wallet keys are required')
    })
  })
})


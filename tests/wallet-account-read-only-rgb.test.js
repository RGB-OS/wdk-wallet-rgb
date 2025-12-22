import { beforeAll, describe, expect, jest, test } from '@jest/globals'

const mockKeys = {
  account_xpub_vanilla: 'xpub6BGG5MockVanilla',
  account_xpub_colored: 'xpub6BGG5MockColored',
  master_fingerprint: '12345678',
  mnemonic: 'test mnemonic',
  xpub: 'tpubD6NzVbkrYhZ4Wsc3NdduD3aW4k8LFd9VFkZnRUtcBtvfDmiydwioba8PWFrJRBQrSSHzfvR8Gz8sGvqV3vm5wEmgT1dcWDAaz2xRKRPaBok',
  xpriv: 'tprv8ZgxMBicQKsPdQaFUyyJodvPVicQ6HxagSy18xrJmd8GPHUD1YuDR5WXL9eUDiNnLfkufjL2EwzWpnkiyck5da731zevC4t34QyR69uTSSX'
}

// Mock rgb-sdk before importing anything that uses it
jest.unstable_mockModule('rgb-sdk', () => {
  const mockWalletManagerInstance = {
    getBtcBalance: jest.fn().mockResolvedValue({ vanilla: { settled: 1000000 } }),
    getAssetBalance: jest.fn().mockResolvedValue({ settled: 500000 }),
    sendBtcBegin: jest.fn().mockResolvedValue('psbt-bytes'),
    signPsbt: jest.fn().mockResolvedValue('signed-psbt'),
    estimateFee: jest.fn().mockResolvedValue({ fee: 1000 }),
    estimateFeeRate: jest.fn().mockResolvedValue(1),
    sendBegin: jest.fn().mockResolvedValue('psbt-bytes'),
    listTransactions: jest.fn().mockResolvedValue([]),
    listTransfers: jest.fn().mockResolvedValue([])
  }

  return {
    WalletManager: jest.fn().mockImplementation(() => mockWalletManagerInstance),
    BIP32_VERSIONS: {
      mainnet: { public: 76067358, private: 76066276 },
      testnet: { public: 70617039, private: 70615956 },
      signet: { public: 70617039, private: 70615956 },
      regtest: { public: 70617039, private: 70615956 }
    }
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
      const address = 'bc1p1234567890abcdefghijklmnopqrstuvwxyz'
      const account = new WalletAccountReadOnlyRgb(address, {
        keys: mockKeys
      })
      expect(account).toBeInstanceOf(WalletAccountReadOnlyRgb)
      // The address is passed to the parent class constructor
      expect(account).toBeDefined()
    })

    test('should create a read-only account with default config', () => {
      const defaultAccount = new WalletAccountReadOnlyRgb('bc1p...', {
        keys: mockKeys
      })
      expect(defaultAccount).toBeInstanceOf(WalletAccountReadOnlyRgb)
    })
  })

  describe('constructor validation', () => {
    test('should throw error if keys are not provided', () => {
      expect(() => {
        new WalletAccountReadOnlyRgb('bc1p...', {})
      }).toThrow('Wallet keys are required for read-only account')
    })
  })
})


import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'

const SEED_PHRASE = 'poem twice question inch happy capital grain quality laptop dry chaos what';
const mockKeys = {
  mnemonic: SEED_PHRASE,
  xpub: 'tpubD6NzVbkrYhZ4XCaTDersU6277zvyyV6uCCeEgx1jfv7bUYMrbTt8Vem1MBt5Gmp7eMwjv4rB54s2kjqNNtTLYpwFsVX7H2H93pJ8SpZFRRi',
  account_xpub_vanilla: 'tpubDDMTD6EJKKLP6Gx9JUnMpjf9NYyePJszmqBnNqULNmcgEuU1yQ3JsHhWZdRFecszWETnNsmhEe9vnaNibfzZkDDHycbR2rGFbXdHWRgBfu7',
  account_xpub_colored: 'tpubDDPLJfdVbDoGtnn6hSto3oCnm6hpfHe9uk2MxcANanxk87EuquhSVfSLQv7e5UykgzaFn41DUXaikjjVGcUSUTGNaJ9LcozfRwatKp1vTfC',
  master_fingerprint: 'a66bffef',
};
// Mock rgb-sdk before importing anything that uses it
jest.unstable_mockModule('../src/libs/rgb-sdk.js', () => {


  const mockWalletManagerInstance = {
    registerWallet: jest.fn().mockResolvedValue(undefined),
    getAddress: jest.fn().mockResolvedValue('bc1p...'),
    getBtcBalance: jest.fn().mockResolvedValue(1000000),
    getAssetBalance: jest.fn().mockResolvedValue(500000),
    listAssets: jest.fn().mockResolvedValue([]),
    listTransfers: jest.fn().mockResolvedValue([]),
    sendBegin: jest.fn().mockResolvedValue('cHNidP8BA...'),
    signPsbt: jest.fn().mockReturnValue('cHNidP8BA...'),
    sendEnd: jest.fn().mockResolvedValue({ txid: 'abc123' }),
    send: jest.fn().mockResolvedValue({ txid: 'abc123' }),
    blindReceive: jest.fn().mockResolvedValue({ invoice: 'rgb1...' }),
    issueAssetNia: jest.fn().mockResolvedValue({ assetId: 'asset123' }),
    createUtxosBegin: jest.fn().mockResolvedValue('cHNidP8BA...'),
    createUtxosEnd: jest.fn().mockResolvedValue(5),
    listUnspents: jest.fn().mockResolvedValue([]),
    listTransactions: jest.fn().mockResolvedValue([]),
    refreshWallet: jest.fn().mockResolvedValue(undefined)
  }

  const deriveKeysFromSeedMock = jest.fn().mockResolvedValue(mockKeys)

  return {
    WalletManager: jest.fn().mockImplementation(() => mockWalletManagerInstance),
    deriveKeysFromMnemonic: jest.fn().mockResolvedValue(mockKeys),
    deriveKeysFromSeed: deriveKeysFromSeedMock,
    createWallet: jest.fn().mockResolvedValue({})
  }
})

const { default: WalletManagerRgb, WalletAccountRgb } = await import('../index.js')


describe('WalletManagerRgb', () => {
  let wallet

  beforeEach(() => {
    wallet = new WalletManagerRgb(SEED_PHRASE, {
      network: 'regtest',
      rgb_node_endpoint: 'http://127.0.0.1:8000'
    })
  })

  afterEach(() => {
    wallet.dispose()
  })

  describe('constructor', () => {
    test('should create a wallet manager with default config', () => {
      const defaultWallet = new WalletManagerRgb(SEED_PHRASE)
      expect(defaultWallet).toBeInstanceOf(WalletManagerRgb)
      defaultWallet.dispose()
    })

    test('should create a wallet manager with custom config', () => {
      const customWallet = new WalletManagerRgb(SEED_PHRASE, {
        network: 'testnet',
        rgb_node_endpoint: 'http://localhost:8000'
      })
      expect(customWallet).toBeInstanceOf(WalletManagerRgb)
      customWallet.dispose()
    })
  })

  describe('getAccountByPath', () => {
    test('should throw an unsupported operation error', async () => {
      await expect(wallet.getAccountByPath("0'/0/0"))
        .rejects.toThrow('Method not supported on the RGB blockchain.')
    })
  })

  describe('getFeeRates', () => {
    test('should return the correct fee rates', async () => {
      const feeRates = await wallet.getFeeRates()

      expect(feeRates.normal).toBe(1n)
      expect(feeRates.fast).toBe(2n)
    })
  })

  describe('restoreAccountFromBackup', () => {
    test('restores account from provided backup data', async () => {
      const backupData = Buffer.from('backup-data')
      const restoredAccount = { restored: true, dispose: jest.fn() }
      const fromBackupSpy = jest.spyOn(WalletAccountRgb, 'fromBackup').mockResolvedValue(restoredAccount)

      const result = await wallet.restoreAccountFromBackup({
        backup: backupData,
        password: 'secure-password',
        filename: 'wallet.rgb',
        keys: mockKeys
      })

      expect(fromBackupSpy).toHaveBeenCalledWith(wallet.seed, expect.objectContaining({
        backup: backupData,
        password: 'secure-password',
        filename: 'wallet.rgb',
        keys: mockKeys,
        network: 'regtest',
        rgb_node_endpoint: 'http://127.0.0.1:8000'
      }))
      expect(result).toBe(restoredAccount)

      wallet._accounts = []
      fromBackupSpy.mockRestore()
    })
  })

  // Note: The following tests require rgb-sdk to be available or properly mocked
  // They are commented out by default as they require an RGB node connection
  /*
  describe('getAccount', () => {
    test('should return the account at index 0 by default', async () => {
      const account = await wallet.getAccount()

      expect(account).toBeInstanceOf(WalletAccountRgb)
      expect(account.index).toBe(0)
      expect(account.path).toBe("m/86'/1'/0'") // regtest uses testnet coin type
    })

    test('should return the account at the given index', async () => {
      const account = await wallet.getAccount(3)

      expect(account).toBeInstanceOf(WalletAccountRgb)
      expect(account.index).toBe(3)
    })

    test('should cache accounts', async () => {
      const account1 = await wallet.getAccount(0)
      const account2 = await wallet.getAccount(0)

      expect(account1).toBe(account2)
    })
  })

  describe('network mapping', () => {
    test('should map MAINNET to mainnet', async () => {
      const mainnetWallet = new WalletManagerRgb(SEED_PHRASE, {
        network: 'MAINNET'
      })
      const account = await mainnetWallet.getAccount()
      expect(account.path).toBe("m/86'/0'/0'")
      mainnetWallet.dispose()
    })

    test('should map TESTNET to testnet', async () => {
      const testnetWallet = new WalletManagerRgb(SEED_PHRASE, {
        network: 'TESTNET'
      })
      const account = await testnetWallet.getAccount()
      expect(account.path).toBe("m/86'/1'/0'")
      testnetWallet.dispose()
    })

    test('should map REGTEST to regtest', async () => {
      const regtestWallet = new WalletManagerRgb(SEED_PHRASE, {
        network: 'REGTEST'
      })
      const account = await regtestWallet.getAccount()
      expect(account.path).toBe("m/86'/1'/0'")
      regtestWallet.dispose()
    })
  })
  */
})


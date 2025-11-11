import { describe, expect, test } from '@jest/globals'

import { WalletAccountReadOnlyRgb } from '../index.js'

const SEED_PHRASE = 'cook voyage document eight skate token alien guide drink uncle term abuse'

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

  describe('quoteSendTransaction', () => {
    test('should return fee quote', async () => {
      const account = new WalletAccountReadOnlyRgb('bc1p...', {})
      const quote = await account.quoteSendTransaction({
        to: 'bc1p...',
        value: 1000
      })
      expect(quote).toHaveProperty('fee')
      expect(quote.fee).toBe(1n)
    })
  })

  describe('quoteTransfer', () => {
    test('should return fee quote', async () => {
      const account = new WalletAccountReadOnlyRgb('bc1p...', {})
      const quote = await account.quoteTransfer({
        assetId: 'asset1',
        to: 'rgb1...',
        value: 1000
      })
      expect(quote).toHaveProperty('fee')
      expect(quote.fee).toBe(1n)
    })
  })

  describe('getTransactionReceipt', () => {
    test('should return null (not implemented)', async () => {
      const account = new WalletAccountReadOnlyRgb('bc1p...', {})
      const receipt = await account.getTransactionReceipt('txid123')
      expect(receipt).toBeNull()
    })
  })

  // Note: The following tests require rgb-sdk to be available or properly mocked
  // They are commented out by default as they require an RGB node connection
  /*
  describe('getBalance', () => {
    test('should return Bitcoin balance', async () => {
      const mockKeys = {
        account_xpub_vanilla: 'xpub6C...',
        account_xpub_colored: 'xpub6D...',
        master_fingerprint: '12345678',
        mnemonic: SEED_PHRASE
      }

      const account = new WalletAccountReadOnlyRgb('bc1p...', {
        network: 'regtest',
        rgb_node_endpoint: 'http://127.0.0.1:8000',
        keys: mockKeys
      })

      const balance = await account.getBalance()
      expect(balance).toBe(BigInt(1000000))
    })
  })

  describe('getTokenBalance', () => {
    test('should return asset balance', async () => {
      // Similar setup as above
    })
  })
  */
})


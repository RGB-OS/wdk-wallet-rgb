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
})


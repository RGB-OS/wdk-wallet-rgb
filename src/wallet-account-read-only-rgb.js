// Copyright 2024 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict'

import { WalletAccountReadOnly } from '@tetherto/wdk-wallet'
import { WalletManager } from './libs/rgb-sdk.js'

/** @typedef {import('@tetherto/wdk-wallet').TransactionResult} TransactionResult */
/** @typedef {import('@tetherto/wdk-wallet').TransferOptions} TransferOptions */
/** @typedef {import('@tetherto/wdk-wallet').TransferResult} TransferResult */

/**
 * @typedef {Object} RgbTransaction
 * @property {string} to - The transaction's recipient.
 * @property {number} value - The amount of bitcoins to send to the recipient (in satoshis).
 */

/**
 * @typedef {Object} RgbWalletConfig
 * @property {string} [network] - The network (default: "regtest").
 * @property {string} [rgb_node_endpoint] - The RGB node endpoint (default: "http://127.0.0.1:8000").
 * @property {Object} [keys] - The wallet keys from rgb-sdk.
 */

export default class WalletAccountReadOnlyRgb extends WalletAccountReadOnly {
  /**
   * Creates a new RGB read-only wallet account.
   *
   * @param {string} address - The account's address.
   * @param {RgbWalletConfig} [config] - The configuration object.
   */
  constructor (address, config = {}) {
    super(address)

    /**
     * The read-only wallet account configuration.
     *
     * @protected
     * @type {RgbWalletConfig}
     */
    this._config = config
    /** @private */
    this._wallet = null
  }

  /**
   * Initializes the RGB wallet manager for read-only operations
   * @private
   */
  async _initializeWallet () {
    if (this._wallet) {
      return this._wallet
    }

    if (!this._config.keys) {
      throw new Error('Wallet keys are required for read-only account')
    }

    const { keys } = this._config
    const network = this._config.network || 'regtest'
    const rgbNodeEndpoint = this._config.rgb_node_endpoint || 'http://127.0.0.1:8000'

    this._wallet = new WalletManager({
      xpub_van: keys.account_xpub_vanilla,
      xpub_col: keys.account_xpub_colored,
      master_fingerprint: keys.master_fingerprint,
      network,
      rgb_node_endpoint: rgbNodeEndpoint
    })

    return this._wallet
  }

  /**
   * Returns the account's bitcoin balance.
   *
   * @returns {Promise<bigint>} The bitcoin balance (in satoshis).
   */
  async getBalance () {
    await this._initializeWallet()
    const balance = await this._wallet.getBtcBalance()
    return BigInt(balance.vanilla.settled || 0)
  }

  /**
   * Returns the account balance for a specific token.
   *
   * @param {string} tokenAddress - The asset ID of the token.
   * @returns {Promise<bigint>} The token balance (in base unit).
   */
  async getTokenBalance (tokenAddress) {
    await this._initializeWallet()
    const balance = await this._wallet.getAssetBalance(tokenAddress)
    return BigInt(balance || 0)
  }

  /**
   * Quotes the costs of a send transaction operation.
   *
   * @param {RgbTransaction} tx - The transaction.
   * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
   */
  async quoteSendTransaction (tx) {
    // RGB transactions use Bitcoin network fees
    // Return a reasonable default
    return { fee: 1n }
  }

  /**
   * Quotes the costs of a transfer operation.
   *
   * @param {TransferOptions} options - The transfer's options.
   * @returns {Promise<Omit<TransferResult, 'hash'>>} The transfer's quotes.
   */
  async quoteTransfer (options) {
    // RGB asset transfers use Bitcoin network fees
    return { fee: 1n }
  }

  /**
   * Returns a transaction's receipt.
   *
   * @param {string} hash - The transaction's hash.
   * @returns {Promise<Object | null>} The receipt, or null if the transaction has not been included in a block yet.
   */
  async getTransactionReceipt (hash) {
    // RGB transactions are tracked differently
    // This would need to be implemented based on rgb-sdk's transaction tracking
    return null
  }
}

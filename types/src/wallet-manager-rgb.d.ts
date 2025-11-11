import type { Readable } from 'node:stream';
/** @typedef {import('@tetherto/wdk-wallet').FeeRates} FeeRates */
/** @typedef {import('./wallet-account-read-only-rgb.js').RgbWalletConfig} RgbWalletConfig */
export default class WalletManagerRgb extends WalletManager {
    /**
     * Creates a new wallet manager for the RGB blockchain.
     *
     * @param {string | Uint8Array} seed - The wallet's [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrase.
     * @param {RgbWalletConfig} [config] - The configuration object.
     */
    constructor(seed: string | Uint8Array, config?: RgbWalletConfig);
    /** @private */
    private _network;
    /** @private */
    private _rgbNodeEndpoint;
    /** @private */
    private _keys;
    /**
     * Initializes the wallet keys from the seed phrase
     * @private
     */
    private _initializeKeys;
    /**
     * Returns the account always at index 0 RGB does not support multiple BIP-44
     *
     * @example
     * const account = await wallet.getAccount();
     * @returns {Promise<WalletAccountRgb>} The account.
     */
    getAccount(): Promise<WalletAccountRgb>;
    /**
     * Restores the account from a wallet backup.
     *
     * @param {Object} restoreConfig - Restore configuration containing backup details.
     * @returns {Promise<WalletAccountRgb>} The restored account.
     */
    restoreAccountFromBackup(restoreConfig?: RgbWalletConfig & {
        backup: Buffer | Uint8Array | ArrayBuffer | Readable;
        password: string;
        filename?: string;
        xpub_van?: string;
        xpub_col?: string;
        master_fingerprint?: string;
        keys?: RgbWalletConfig["keys"];
    }): Promise<WalletAccountRgb>;
    /**
     * Returns the wallet account at a specific BIP-44 derivation path.
     *
     * @param {string} path - The derivation path (e.g. "0'/0/0").
     * @returns {Promise<WalletAccountRgb>} The account.
     */
    getAccountByPath(path: string): Promise<WalletAccountRgb>;
}
export type FeeRates = import("@tetherto/wdk-wallet").FeeRates;
export type RgbWalletConfig = import("./wallet-account-read-only-rgb.js").RgbWalletConfig;
import WalletManager from '@tetherto/wdk-wallet';

/** @typedef {import('@tetherto/wdk-wallet').IWalletAccount} IWalletAccount */
/** @typedef {import('@tetherto/wdk-wallet').KeyPair} KeyPair */
/** @typedef {import('@tetherto/wdk-wallet').TransactionResult} TransactionResult */
/** @typedef {import('@tetherto/wdk-wallet').TransferOptions} TransferOptions */
/** @typedef {import('@tetherto/wdk-wallet').TransferResult} TransferResult */
import type { Readable } from 'node:stream';
/** @typedef {import('./wallet-account-read-only-rgb.js').RgbTransaction} RgbTransaction */
/** @typedef {import('./wallet-account-read-only-rgb.js').RgbWalletConfig} RgbWalletConfig */
/** @implements {IWalletAccount} */
export default class WalletAccountRgb extends WalletAccountReadOnlyRgb implements IWalletAccount {
    /**
     * Creates a new RGB wallet account.
     *
     * @param {string | Uint8Array} seed - The wallet's [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrase.
     * @param {RgbWalletConfig} [config] - The configuration object.
     * @returns {Promise<WalletAccountRgb>} The wallet account.
     */
    static at(seed: string | Uint8Array, config?: RgbWalletConfig): Promise<WalletAccountRgb>;
    /**
     * Restores an RGB wallet account from an encrypted backup.
     *
     * @param {string | Uint8Array} seed - The wallet's BIP-39 seed phrase.
     * @param {RgbWalletConfig & { backup: Buffer | Uint8Array | ArrayBuffer | Readable, password: string, filename?: string, xpub_van?: string, xpub_col?: string, master_fingerprint?: string }} config - The configuration object with backup data.
     * @returns {Promise<WalletAccountRgb>} The restored wallet account.
     */
    static fromBackup(seed: string | Uint8Array, config: RgbWalletConfig & {
        backup: Buffer | Uint8Array | ArrayBuffer | Readable;
        password: string;
        filename?: string;
        xpub_van?: string;
        xpub_col?: string;
        master_fingerprint?: string;
    }): Promise<WalletAccountRgb>;
    /** @package */
    constructor(wallet: any, config?: {});
    /** @private */
    private _wallet;
    /** @private */
    private _index;
    /** @private */
    private _keyPair;
    /**
     * The derivation path's index of this account.
     *
     * @type {number}
     */
    get index(): number;
    /**
     * The derivation path of this account.
     * Note: RGB SDK uses BIP-86 (Taproot) derivation, not BIP-44.
     * RGB SDK handles key derivation internally using:
     * - Vanilla (Bitcoin): m/86'/0'/0' (mainnet) or m/86'/1'/0' (testnet)
     * - Colored (RGB): m/86'/827166'/0' (mainnet) or m/86'/827167'/0' (testnet)
     * This getter returns a representation for WDK interface compatibility.
     *
     * @type {string}
     */
    get path(): string;
    /**
     * The account's key pair.
     * Note: This derives keys using the same BIP-86 path that rgb-sdk uses for WDK interface compatibility.
     * RGB SDK handles all actual operations internally.
     * Includes RGB-specific fields: accountXpubVanilla, accountXpubColored, masterFingerprint.
     *
     * @type {KeyPair & { accountXpubVanilla?: string, accountXpubColored?: string, masterFingerprint?: string}}
     */
    get keyPair(): KeyPair & {
        accountXpubVanilla?: string;
        accountXpubColored?: string;
        masterFingerprint?: string;
    };
    /**
     * Signs a message using Bitcoin message signing.
     *
     * @param {string} message - The message to sign.
     * @returns {Promise<string>} The message's signature.
     */
    sign(message: string): Promise<string>;
    /**
     * Verifies a message's signature.
     *
     * @param {string} message - The original message.
     * @param {string} signature - The signature to verify.
     * @returns {Promise<boolean>} True if the signature is valid.
     */
    verify(message: string, signature: string): Promise<boolean>;
    /**
     * Sends a Bitcoin transaction (for UTXO management).
     * Note: For RGB asset transfers, use transfer() instead.
     * This method uses the RGB SDK's sendBegin/sendEnd flow for Bitcoin transactions.
     *
     * @param {RgbTransaction} tx - The transaction.
     * @param {string} tx.to - Recipient Bitcoin address.
     * @param {number} tx.value - Amount in satoshis.
     * @param {number} [tx.feeRate] - Fee rate in sat/vbyte (default: 1).
     * @returns {Promise<TransactionResult>} The transaction's result.
     */
    sendTransaction({ to, value, feeRate }: RgbTransaction): Promise<TransactionResult>;
    /**
     * Transfers an RGB asset to another wallet.
     * This method implements the RGB transfer flow using sendBegin/sendEnd.
     *
     * @param {TransferOptions} options - The transfer's options.
     * @property {string} options.asset_id - The RGB asset ID to transfer.
     * @property {string} options.to - The recipient's invoice (from blindReceive).
     * @property {number} options.value - The amount to transfer.
     * @property {number} [options.fee_rate] - The fee rate in sat/vbyte (default: 1).
     * @property {number} [options.min_confirmations] - Minimum confirmations (default: 1).
     * @returns {Promise<TransferResult>} The transfer's result.
     */
    transfer(options: TransferOptions): Promise<TransferResult>;
    /**
     * Returns the transfer history of the account.
     *
     * @param {Object} [options] - The options.
     * @param {"incoming" | "outgoing" | "all"} [options.direction] - If set, only returns transfers with the given direction (default: "all").
     * @param {number} [options.limit] - The number of transfers to return (default: 10).
     * @param {number} [options.skip] - The number of transfers to skip (default: 0).
     * @param {string} [options.asset_id] - Optional asset ID to filter transfers.
     * @returns {Promise<Array>} The transfers.
     */
    getTransfers(options?: {
        direction?: "incoming" | "outgoing" | "all";
        limit?: number;
        skip?: number;
        asset_id?: string;
    }): Promise<any[]>;
    /**
     * Returns a read-only copy of the account.
     *
     * @returns {Promise<WalletAccountReadOnlyRgb>} The read-only account.
     */
    toReadOnlyAccount(): Promise<WalletAccountReadOnlyRgb>;
    /**
     * Disposes the wallet account, erasing its private keys from the memory.
     * Note: RGB SDK manages keys internally, but we clear our derived keyPair.
     */
    dispose(): void;
    /**
     * Gets the underlying RGB SDK WalletManager instance.
     * This allows direct access to all RGB SDK methods.
     *
     * @returns {WalletManager} The RGB SDK WalletManager instance.
     */
    getRgbWallet(): typeof import("rgb-sdk").WalletManager;
    /**
     * Lists all RGB assets in the wallet.
     *
     * @returns {Promise<Array>} Array of asset objects.
     */
    listAssets(): Promise<any[]>;
    /**
     * Issues a new NIA (Non-Inflatable Asset).
     *
     * @param {Object} options - Issue options.
     * @param {string} options.ticker - Asset ticker symbol.
     * @param {string} options.name - Asset name.
     * @param {Array<number>} options.amounts - Array of amounts to issue.
     * @param {number} options.precision - Decimal precision.
     * @returns {Promise<Object>} The issued asset.
     */
    issueAssetNia(options: {
        ticker: string;
        name: string;
        amounts: Array<number>;
        precision: number;
    }): Promise<any>;
    /**
     * Creates an invoice for receiving RGB assets. Defaults to blind receive, with optional witness support.
     *
     * @param {Object} options - Receive options.
     * @param {string} [options.asset_id] - The asset ID to receive.
     * @param {number} options.amount - The amount to receive.
     * @param {boolean} [options.witness] - If true, uses witnessReceive flow.
     * @returns {Promise<Object>} Receive data including invoice.
     */
    receiveAsset(options: {
        asset_id?: string;
        amount: number;
        witness?: boolean;
    }): Promise<any>;
    /**
     * Begins a send operation (creates PSBT).
     *
     * @param {Object} options - Send options.
     * @param {string} options.invoice - The blind receive invoice.
     * @param {string} options.asset_id - The RGB asset ID to transfer.
     * @param {Object} options.witness_data - The witness data.
     * @param {number} options.amount - The amount to transfer.
     * @param {number} [options.fee_rate] - Fee rate in sat/vbyte (default: 1).
     * @param {number} [options.min_confirmations] - Minimum confirmations (default: 1).
     * @returns {Promise<string>} The PSBT (base64 encoded).
     */
    sendBegin(options: {
        invoice: string;
        asset_id: string;
        witness_data: any;
        amount: number;
        fee_rate?: number;
        min_confirmations?: number;
    }): Promise<string>;
    /**
     * Signs a PSBT.
     *
     * @param {string} psbt - The PSBT to sign (base64 encoded).
     * @returns {string} The signed PSBT (base64 encoded).
     */
    signPsbt(psbt: string): string;
    /**
     * Brodcasts a send transaction.
     *
     * @param {Object} options - Send end options.
     * @param {string} options.signed_psbt - The signed PSBT (base64 encoded).
     * @returns {Promise<Object>} The send result.
     */
    sendEnd(options: {
        signed_psbt: string;
    }): Promise<any>;
    /**
     * Complete send operation (combines sendBegin, signPsbt, sendEnd).
     *
     * @param {Object} options - Send options.
     * @param {string} options.invoice - The blind receive invoice.
     * @param {string} options.asset_id - The RGB asset ID to transfer.
     * @param {Object} options.witness_data - The witness data.
     * @param {number} options.amount - The amount to transfer.
     * @param {number} [options.fee_rate] - Fee rate in sat/vbyte (default: 1).
     * @param {number} [options.min_confirmations] - Minimum confirmations (default: 1).
     * @returns {Promise<Object>} The send result.
     */
    send(options: {
        invoice: string;
        asset_id: string;
        witness_data: any;
        amount: number;
        fee_rate?: number;
        min_confirmations?: number;
    }): Promise<any>;
    /**
     * Creates UTXOs. Combines createUtxosBegin,signPsbt,createUtxosEnd.
     *
     * @param {Object} options - Create UTXOs options.
     * @param {boolean} [options.up_to] - Create up to specified number (default: true).
     * @param {number} [options.num] - Number of UTXOs to create.
     * @param {number} [options.size] - Size of each UTXO in satoshis.
     * @param {number} [options.fee_rate] - Fee rate in sat/vbyte (default: 1).
     * @returns {Promise<string>} The PSBT (base64 encoded).
     */
    createUtxos(options: {
        up_to?: boolean;
        num?: number;
        size?: number;
        fee_rate?: number;
    }): Promise<string>;
    /**
     * Begins UTXO creation operation.
     *
     * @param {Object} options - UTXO creation options.
     * @param {boolean} [options.up_to] - Create up to specified number (default: true).
     * @param {number} [options.num] - Number of UTXOs to create.
     * @param {number} [options.size] - Size of each UTXO in satoshis.
     * @param {number} [options.fee_rate] - Fee rate in sat/vbyte (default: 1).
     * @returns {Promise<string>} The PSBT (base64 encoded).
     */
    createUtxosBegin(options: {
        up_to?: boolean;
        num?: number;
        size?: number;
        fee_rate?: number;
    }): Promise<string>;
    /**
     * Finalizes UTXO creation operation.
     *
     * @param {Object} options - UTXO creation end options.
     * @param {string} options.signed_psbt - The signed PSBT (base64 encoded).
     * @returns {Promise<number>} Number of UTXOs created.
     */
    createUtxosEnd(options: {
        signed_psbt: string;
    }): Promise<number>;
    /**
     * Lists unspent transaction outputs (UTXOs).
     *
     * @returns {Promise<Array>} Array of UTXO objects.
     */
    listUnspents(): Promise<any[]>;
    /**
     * Lists Bitcoin transactions.
     *
     * @returns {Promise<Array>} Array of transaction objects.
     */
    listTransactions(): Promise<any[]>;
    /**
     * Lists transfers for a specific asset.
     *
     * @param {string} assetId - The asset ID.
     * @returns {Promise<Array>} Array of transfer objects.
     */
    listTransfers(assetId: string): Promise<any[]>;
    /**
     * Creates an encrypted backup of the wallet.
     *
     * @param {string} password - The password used to encrypt the backup file.
     * @returns {Promise<any>} The backup response from rgb-sdk.
     */
    createBackup(password: string): Promise<any>;
    /**
     * Downloads an existing wallet backup.
     *
     * @param {string} [backupId] - The backup identifier (defaults to wallet xpub if omitted).
     * @returns {Promise<ArrayBuffer | Buffer>} The backup file contents.
     */
    downloadBackup(backupId?: string): Promise<ArrayBuffer | Buffer>;
    /**
     * Restores a wallet from a backup file.
     *
     * @param {Object} params - Restore options.
     * @param {Buffer | Uint8Array | ArrayBuffer | Readable} params.backup - The backup file data.
     * @param {string} params.password - The password used to encrypt the backup.
     * @param {string} [params.filename] - Optional filename metadata.
     * @param {string} [params.xpub_van] - Optional vanilla xpub override.
     * @param {string} [params.xpub_col] - Optional colored xpub override.
     * @param {string} [params.master_fingerprint] - Optional master fingerprint override.
     * @returns {Promise<any>} The restore response from rgb-sdk.
     */
    restoreFromBackup(params: {
        backup: Buffer | Uint8Array | ArrayBuffer | Readable;
        password: string;
        filename?: string;
        xpub_van?: string;
        xpub_col?: string;
        master_fingerprint?: string;
    }): Promise<any>;
    /**
     * Refreshes the wallet state
     *
     * @returns {Promise<void>}
     */
    refreshWallet(): Promise<void>;
    /**
     * Registers the wallet with the RGB node.
     *
     * @returns {Promise<void>}
     */
    registerWallet(): Promise<void>;
    /**
     * Syncs RGB wallet state with Bitcoin blockchain.
     *
     * @returns {Promise<void>}
     */
    syncWallet(): Promise<void>;
}
export type IWalletAccount = import("@tetherto/wdk-wallet").IWalletAccount;
export type KeyPair = import("@tetherto/wdk-wallet").KeyPair;
export type TransactionResult = import("@tetherto/wdk-wallet").TransactionResult;
export type TransferOptions = import("@tetherto/wdk-wallet").TransferOptions;
export type TransferResult = import("@tetherto/wdk-wallet").TransferResult;
export type RgbTransaction = import("./wallet-account-read-only-rgb.js").RgbTransaction;
export type RgbWalletConfig = import("./wallet-account-read-only-rgb.js").RgbWalletConfig;
import WalletAccountReadOnlyRgb from './wallet-account-read-only-rgb.js';

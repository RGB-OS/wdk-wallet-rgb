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
    constructor(address: string, config?: RgbWalletConfig);
    /**
     * The read-only wallet account configuration.
     *
     * @protected
     * @type {RgbWalletConfig}
     */
    protected _config: RgbWalletConfig;
    /** @private */
    private _wallet;
    /**
     * Initializes the RGB wallet manager for read-only operations
     * @private
     */
    private _initializeWallet;
    /**
     * Quotes the costs of a send transaction operation.
     *
     * @param {Transaction} tx - The transaction.
     * @param {string} tx.to - The transaction's recipient.
     * @param {number} tx.value - The amount of bitcoins to send to the recipient (in satoshis).
     * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
     */
    quoteSendTransaction({ to, value }: Transaction): Promise<Omit<TransactionResult, "hash">>;
    /**
     * Returns a transaction's receipt.
     *
     * @param {string} hash - The transaction's hash.
     * @returns {Promise<Object | null>} The receipt, or null if the transaction has not been included in a block yet.
     */
    getTransactionReceipt(hash: string): Promise<any | null>;
}
export type TransactionResult = import("@tetherto/wdk-wallet").TransactionResult;
export type TransferOptions = import("@tetherto/wdk-wallet").TransferOptions;
export type TransferResult = import("@tetherto/wdk-wallet").TransferResult;
export type RgbTransaction = {
    /**
     * - The transaction's recipient.
     */
    to: string;
    /**
     * - The amount of bitcoins to send to the recipient (in satoshis).
     */
    value: number;
};
export type RgbWalletConfig = {
    /**
     * - The network (default: "regtest").
     */
    network?: string;
    /**
     * - The RGB node endpoint (default: "http://127.0.0.1:8000").
     */
    rgb_node_endpoint?: string;
    /**
     * - The wallet keys from rgb-sdk.
     */
    keys?: any;
};
import { WalletAccountReadOnly } from '@tetherto/wdk-wallet';

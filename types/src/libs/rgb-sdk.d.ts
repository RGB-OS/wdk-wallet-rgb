export const WalletManager: typeof rgbSdk.WalletManager;
export const createWallet: (network?: string | number) => Promise<rgbSdk.GeneratedKeys>;
export const deriveKeysFromSeed: typeof rgbSdk.deriveKeysFromSeed;
export const Network: any;
import * as rgbSdk from 'rgb-sdk';

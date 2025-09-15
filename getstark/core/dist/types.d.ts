import { WalletProvider } from "./discovery";
import { IStorageWrapper } from "./localStorageStore";
import { FilterList } from "./wallet/filter";
import { Sort } from "./wallet/sort";
import type { RequestAccountsParameters, StarknetWindowObject } from "@starknet-io/types-js";
export type { BrowserStoreVersion, OperatingSystemStoreVersion, WalletProvider, } from "./discovery";
export interface GetStarknetOptions {
    windowObject: Record<string, any>;
    isWalletObject: (wallet: unknown) => boolean;
    storageFactoryImplementation: (name: string) => IStorageWrapper;
}
export interface GetWalletOptions {
    sort?: Sort;
    include?: FilterList;
    exclude?: FilterList;
}
export interface DisconnectOptions {
    clearLastWallet?: boolean;
}
export interface VirtualWallet {
    id: string;
    name: string;
    icon: string;
    windowKey: string;
    loadWallet: (windowObject: Record<string, unknown>) => Promise<StarknetWindowObject>;
    hasSupport: (windowObject: Record<string, unknown>) => Promise<boolean>;
}
export interface EvmWallet {
    sendAsync?: (request: {
        method: string;
        params?: Array<unknown>;
    }, callback: (error: Error | null, response: unknown) => void) => void;
    send?: (request: {
        method: string;
        params?: Array<unknown>;
    }, callback: (error: Error | null, response: unknown) => void) => void;
    request: (request: {
        method: string;
        params?: Array<unknown>;
    }) => Promise<unknown>;
}
export declare const virtualWalletKeys: (keyof VirtualWallet)[];
export declare const fullWalletKeys: (keyof StarknetWindowObject)[];
export declare const evmWalletKeys: (keyof EvmWallet)[];
export interface GetStarknetResult {
    getAvailableWallets: (options?: GetWalletOptions) => Promise<StarknetWindowObject[]>;
    getAuthorizedWallets: (options?: GetWalletOptions) => Promise<StarknetWindowObject[]>;
    getDiscoveryWallets: (options?: GetWalletOptions) => Promise<WalletProvider[]>;
    getLastConnectedWallet: () => Promise<StarknetWindowObject | null | undefined>;
    discoverVirtualWallets: () => Promise<void>;
    enable: (wallet: StarknetWindowObject | VirtualWallet, options?: RequestAccountsParameters) => Promise<StarknetWindowObject>;
    disconnect: (options?: DisconnectOptions) => Promise<void>;
}
declare global {
    interface Window {
        [key: string]: unknown;
    }
}

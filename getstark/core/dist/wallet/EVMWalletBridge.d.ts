import { WalletEventListener } from "@starknet-io/types-js";
import { RequestFn } from "@starknet-io/types-js";
interface Request extends RequestFn {
    (request: {
        method: string;
        params?: Array<unknown>;
    }): Promise<unknown>;
}
export interface EVMWalletProvider {
    request: Request;
    on: WalletEventListener;
    off: WalletEventListener;
    id: string;
    name: string;
    icon: string;
    version: "1.0.0";
}
export interface EVMWalletInfo {
    icon: string;
    name: string;
    rdns: string;
    uuid: string;
    version: "1.0.0";
}
export declare function detectEVMSupport(windowObject: Record<string, unknown>): Promise<{
    provider: EVMWalletProvider | null;
    info: EVMWalletInfo | null;
}[]>;
export {};

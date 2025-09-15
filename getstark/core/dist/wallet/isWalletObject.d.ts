declare const isFullWallet: (obj: unknown) => obj is {
    request: any;
    id: any;
    name: any;
    icon: any;
    version: any;
    on: any;
    off: any;
};
declare const isVirtualWallet: (obj: unknown) => obj is {
    id: any;
    name: any;
    icon: any;
    windowKey: any;
    loadWallet: any;
    hasSupport: any;
};
declare const isEvmWallet: (obj: unknown) => obj is {
    sendAsync: any;
    send: any;
    request: any;
};
declare function isWalletObject(wallet: unknown): boolean;
export { isVirtualWallet, isFullWallet, isWalletObject, isEvmWallet };

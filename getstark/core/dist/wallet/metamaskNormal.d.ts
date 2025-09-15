import { WalletEventListener } from "@starknet-io/types-js"

interface MetaMaskProvider {
  isMetaMask: boolean
  request: (request: {
    method: string
    params?: Array<unknown>
  }) => Promise<unknown>
  on: WalletEventListener
  off: WalletEventListener
}
export declare function detectMetamaskSupport(
  windowObject: Record<string, unknown>,
): Promise<MetaMaskProvider | null>
export {}

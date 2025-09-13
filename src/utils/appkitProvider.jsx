/* eslint-disable no-unused-vars */
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { defineChain, sepolia } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = "26f04a72b999722f634c0d20ad88561d";

const rosettanetRender = "https://rosettanet.onrender.com/";
const rosettanetLocal = "http://localhost:3000/";

const metadata = {
  name: "Rosy",
  description: "Rosettanet Alpha Examples",
  url: "https://rosettanet-alpha-examples.vercel.app",
  icons: ["https://rosettanet-alpha-examples.vercel.app/logo192.jpg"],
};

const rosettanetSepolia = defineChain({
  id: 1381192787,
  caipNetworkId: "eip155:1381192787",
  chainNamespace: "eip155",
  name: "Rosettanet",
  nativeCurrency: {
    decimals: 18,
    name: "Starknet Token",
    symbol: "STRK",
  },
  rpcUrls: {
    default: {
      http: [rosettanetRender],
    },
  },
  blockExplorers: {
    default: { name: "Voyager", url: "https://sepolia.voyager.online" },
  },
  contracts: {
    // Add the contracts here
  },
});

// 3. Set the networks
const networks = [rosettanetSepolia, sepolia];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  // connectors,
  ssr: false,
});

export const reownConfig = wagmiAdapter.wagmiConfig;

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
  },
});

// Add utility function to clear connection cache
export const clearAppKitCache = () => {
  try {
    // Clear localStorage keys related to WalletConnect/Reown
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes("wc@2") ||
          key.includes("wagmi") ||
          key.includes("appkit") ||
          key.includes("reown"))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Clear sessionStorage as well
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (
        key &&
        (key.includes("wc@2") ||
          key.includes("wagmi") ||
          key.includes("appkit") ||
          key.includes("reown"))
      ) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key));

    console.log("AppKit cache cleared");
    return true;
  } catch (error) {
    console.error("Error clearing AppKit cache:", error);
    return false;
  }
};

// Force clear MetaMask connection requests
export const forceDisconnectMetaMask = async () => {
  try {
    // Clear all wallet-related cache first
    clearAppKitCache();

    // Try to access MetaMask directly if available
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Request accounts to check current state
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts && accounts.length > 0) {
          // If connected, try to disconnect
          try {
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [{ eth_accounts: {} }],
            });
          } catch (e) {
            // Permission request may fail, that's okay
            console.log("Permission request failed (expected):", e.message);
          }
        }
      } catch (e) {
        console.log("MetaMask account check failed:", e.message);
      }
    }

    // Clear any pending connection promises
    if (window.ethereum && window.ethereum._state) {
      window.ethereum._state.accounts = null;
      window.ethereum._state.isConnected = false;
    }

    return true;
  } catch (error) {
    console.error("Error force disconnecting MetaMask:", error);
    return false;
  }
};

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

// then awesome decide sell foster ankle tip champion brief tortoise crowd field

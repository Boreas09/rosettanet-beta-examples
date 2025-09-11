/* eslint-disable no-unused-vars */
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { defineChain, sepolia } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = '26f04a72b999722f634c0d20ad88561d';

const rosettanetRender = 'https://rosettanet.onrender.com/';
const rosettanetLocal = 'http://localhost:3000/';

const metadata = {
  name: 'Rosy',
  description: 'Rosettanet Alpha Examples',
  url: 'https://rosettanet-alpha-examples.vercel.app',
  icons: ['https://rosettanet-alpha-examples.vercel.app/logo192.jpg'],
};

const rosettanetSepolia = defineChain({
  id: 1381192787,
  caipNetworkId: 'eip155:1381192787',
  chainNamespace: 'eip155',
  name: 'Rosettanet',
  nativeCurrency: {
    decimals: 18,
    name: 'Starknet Token',
    symbol: 'STRK',
  },
  rpcUrls: {
    default: {
      http: [rosettanetRender],
    },
  },
  blockExplorers: {
    default: { name: 'Voyager', url: 'https://sepolia.voyager.online' },
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

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

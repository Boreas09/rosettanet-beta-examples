# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a RosettaNet BETA testing application built with React + Vite, featuring a responsive sidebar navigation and Web3 wallet integration. RosettaNet is middleware software that acts like an Ethereum RPC, making requests to the Starknet network while outputting Ethereum RPC responses. This allows users to interact with Starknet using existing EVM wallets.

## Development Commands

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

## Key Dependencies & Architecture

- **React 19.1.1** with Vite 7.1.2 as the build tool
- **Chakra UI v3** (3.26.0) for components using composition API patterns
- **React Router v7** (7.8.2) for client-side routing with nested routes
- **Web3 Stack**: 
  - Starknet.js 6.24.1 for Starknet blockchain interactions
  - Wagmi + Viem for Ethereum interactions
  - Reown AppKit for wallet connections and UI
- **Styling**: next-themes for theme switching, supports light/dark modes
- **State Management**: React Query for server state, React hooks for local state
- **Toast System**: Custom Chakra UI v3 toaster implementation

## Application Architecture

### Provider Hierarchy (main.jsx)
```
AppKitProvider (Wagmi + QueryClient)
  └── ChakraProvider (UI components)
    └── ThemeProvider (Dark/light themes)  
      └── RouterProvider (React Router v7)
```

### Routing Structure
- Nested routing with shared layout (`App.jsx`)
- Routes: Dashboard (`/`), Profile (`/profile`), Analytics (`/analytics`), Settings (`/settings`)
- Responsive sidebar navigation with mobile hamburger menu

### Component Architecture
- **Sidebar**: Responsive navigation with wallet integration, supports collapsed/mobile states
- **Dashboard**: Main RosettaNet information page with ETH-to-Starknet address conversion
- **Wallet Integration**: Connect wallet, add RosettaNet chain, add RosettaNet ETH tokens
- **Toast System**: Global toast notifications using `src/components/ui/toaster.jsx`

### Starknet Integration
- Uses multiple RosettaNet contract addresses for different environments
- ETH address to Starknet address conversion via smart contracts
- Configured for Sepolia testnet integration
- RPC endpoints: `https://rosettanet.onrender.com/` (production), `http://localhost:3000/` (local)

## Chakra UI v3 Patterns

- **Compound Components**: Use `ComponentName.Root`, `ComponentName.Control`, etc.
- **Toast System**: Import from `./components/ui/toaster`, use `toaster.create({ type, title, description })`
- **Button Loading**: Use `loading` prop instead of `isLoading`
- **List Components**: Use `List.Root` and `List.Item` instead of `UnorderedList`/`ListItem`
- **Semantic Colors**: Use `bg`, `fg`, `border` tokens that adapt to light/dark mode

## Custom Network Configuration

The app includes a custom RosettaNet network definition:
- Chain ID: 1381192787 (0x52535453)
- Native currency: STRK 
- Block explorer: Voyager (Sepolia)
- RPC URL: Configurable between render.com and localhost

## Code Conventions

- ES modules (`type: "module"` in package.json)
- JSX files with `.jsx` extension
- Modern React patterns (no React imports needed)
- ESLint flat config with React hooks validation
- StrictMode enabled for development
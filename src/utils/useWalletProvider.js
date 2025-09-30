import { useState, useEffect } from "react";

/**
 * Custom hook to detect wallet providers using EIP-6963 standard
 * Falls back to window.ethereum if EIP-6963 is not supported
 * @returns {Object|null} - Wallet provider object or null if no wallet is available
 */
export function useWalletProvider() {
  const [walletProvider, setWalletProvider] = useState(null);

  useEffect(() => {
    // EIP-6963: Modern wallet detection standard
    const providers = [];

    const handleAnnouncement = (event) => {
      providers.push(event.detail);
      // Use the first available provider
      if (!walletProvider && event.detail?.provider) {
        setWalletProvider(event.detail.provider);
      }
    };

    window.addEventListener("eip6963:announceProvider", handleAnnouncement);

    // Request wallet providers to announce themselves
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    // Fallback to window.ethereum after a short delay if no EIP-6963 providers found
    const fallbackTimeout = setTimeout(() => {
      if (providers.length === 0 && typeof window.ethereum !== "undefined") {
        setWalletProvider(window.ethereum);
      }
    }, 100);

    return () => {
      window.removeEventListener("eip6963:announceProvider", handleAnnouncement);
      clearTimeout(fallbackTimeout);
    };
  }, []); // Empty dependency array to run only once

  return walletProvider;
}
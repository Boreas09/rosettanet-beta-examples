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
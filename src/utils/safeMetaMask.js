// Safe MetaMask request function to handle private member errors
export const safeMetaMaskRequest = async (method, params = []) => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not found');
    }

    // Check if ethereum object is properly initialized
    if (!window.ethereum.request) {
      throw new Error('MetaMask request method not available');
    }

    // Reset any corrupted state
    if (window.ethereum._state) {
      delete window.ethereum._state;
    }

    const result = await window.ethereum.request({
      method,
      params
    });

    return result;
  } catch (error) {
    console.error(`MetaMask ${method} error:`, error);
    
    // If private member error, try to reload the page
    if (error.message.includes('private member')) {
      console.warn('MetaMask private member error detected, reloading...');
      window.location.reload();
      return;
    }
    
    throw error;
  }
};

// Safe account request
export const safeRequestAccounts = async () => {
  return await safeMetaMaskRequest('eth_requestAccounts', []);
};

// Safe get accounts
export const safeGetAccounts = async () => {
  return await safeMetaMaskRequest('eth_accounts', []);
};

// Reset MetaMask state completely
export const resetMetaMaskState = () => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Clear any cached state
      if (window.ethereum._state) {
        window.ethereum._state = null;
      }
      
      // Clear any pending promises
      if (window.ethereum._pendingRequests) {
        window.ethereum._pendingRequests = [];
      }
      
      // Clear any event listeners that might be corrupted
      if (window.ethereum.removeAllListeners) {
        window.ethereum.removeAllListeners();
      }
      
      console.log('MetaMask state reset successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error resetting MetaMask state:', error);
    return false;
  }
};
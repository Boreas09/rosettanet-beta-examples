import { useCallback, useRef } from "react";
import { useAppKit } from "@reown/appkit/react";

/**
 * Custom hook to handle AppKit modal operations with debouncing
 * This prevents the Lit Element warning by ensuring modal state changes
 * happen after React's update cycle completes
 */
export function useAppKitModal() {
  const { open } = useAppKit();
  const timeoutRef = useRef(null);

  const debouncedOpen = useCallback((options = {}) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule the modal opening after React's update cycle
    timeoutRef.current = setTimeout(() => {
      open(options);
    }, 10); // Small delay to ensure React updates complete
  }, [open]);

  const openAccount = useCallback(() => {
    debouncedOpen({ view: "Account" });
  }, [debouncedOpen]);

  const openConnect = useCallback(() => {
    debouncedOpen();
  }, [debouncedOpen]);

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    openAccount,
    openConnect,
    cleanup
  };
}
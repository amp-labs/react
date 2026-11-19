/**
 * High-level hook that manages the full OAuth popup lifecycle.
 * Opens the popup, listens for authorization events, and cleans up automatically.
 *
 * For lower-level control over the popup, use `useOAuthPrimitives` instead.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { openCenteredPopup } from "./oauthPopupUtils";
import type {
  OAuthCallbacks,
  OAuthConnectionMode,
  OAuthPopupOptions,
} from "./types";
import { useOAuthPrimitives } from "./useOAuthPrimitives";

const POPUP_POLL_INTERVAL_MS = 500;

export function useOAuthConnect(mode: OAuthConnectionMode) {
  const {
    getOAuthUrl,
    isGeneratingUrl,
    startListening,
    stopListening,
    isListening,
    connectionId,
    error: primitivesError,
  } = useOAuthPrimitives(mode);

  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbacksRef = useRef<OAuthCallbacks | undefined>(undefined);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync error from primitives
  useEffect(() => {
    if (primitivesError) {
      setError(primitivesError);
    }
  }, [primitivesError]);

  const cleanup = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    stopListening();
    setIsPopupOpen(false);
  }, [stopListening]);

  const closePopup = useCallback(() => {
    popupRef.current?.close();
    popupRef.current = null;
    cleanup();
  }, [cleanup]);

  // React to authorization results from primitives
  useEffect(() => {
    if (connectionId) {
      callbacksRef.current?.onSuccess?.(connectionId);
      closePopup();
    }
  }, [connectionId, closePopup]);

  useEffect(() => {
    if (primitivesError) {
      callbacksRef.current?.onError?.(new Error(primitivesError));
      closePopup();
    }
  }, [primitivesError, closePopup]);

  // Start polling for popup closure (user closed the window manually)
  const startPopupPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        cleanup();
        popupRef.current = null;
      }
    }, POPUP_POLL_INTERVAL_MS);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      stopListening();
    };
  }, [stopListening]);

  const connect = useCallback(
    async (callbacks?: OAuthCallbacks, popupOptions?: OAuthPopupOptions) => {
      callbacksRef.current = callbacks;
      setError(null);

      const url = await getOAuthUrl();
      if (!url) return;

      const popup = openCenteredPopup(url, popupOptions);
      if (!popup) {
        const err =
          "Failed to open popup window. Please check your popup blocker settings.";
        setError(err);
        callbacks?.onError?.(new Error(err));
        return;
      }

      popupRef.current = popup;
      setIsPopupOpen(true);
      startListening();
      startPopupPolling();
    },
    [getOAuthUrl, startListening, startPopupPolling],
  );

  const reset = useCallback(() => {
    setError(null);
    closePopup();
  }, [closePopup]);

  return {
    connect,
    connectionId,
    error,
    isConnecting: isGeneratingUrl || isListening,
    isPopupOpen,
    closePopup,
    reset,
  };
}

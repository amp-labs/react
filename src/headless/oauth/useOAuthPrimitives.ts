/**
 * Low-level hook providing OAuth URL generation and message listener utilities.
 * Use this when you need full control over the popup window lifecycle.
 * For a managed experience, use `useOAuthConnect` instead.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { enableCSRFProtection } from "src/components/auth/Oauth/AuthorizationCode/enableCSRFprotection";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useCreateOauthConnectionMutation } from "src/hooks/mutation/useCreateOauthConnectionMutation";
import { useUpdateOauthConnectMutation } from "src/hooks/mutation/useUpdateOauthConnectMutation";

import { isValidOAuthOrigin } from "./oauthPopupUtils";
import type { OAuthAuthorizationEvent, OAuthConnectionMode } from "./types";

export function useOAuthPrimitives(mode: OAuthConnectionMode) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const queryClient = useQueryClient();

  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const listenerRef = useRef<((ev: MessageEvent) => void) | null>(null);

  const { mutateAsync: createOauthUrl, isPending: isCreatePending } =
    useCreateOauthConnectionMutation();

  const { mutateAsync: updateOauthUrl, isPending: isUpdatePending } =
    useUpdateOauthConnectMutation();

  const isGeneratingUrl = isCreatePending || isUpdatePending;

  const handleMessage = useCallback(
    (ev: MessageEvent<OAuthAuthorizationEvent>) => {
      if (!isValidOAuthOrigin(ev.origin)) return;

      if (ev.data?.eventType === "AUTHORIZATION_SUCCEEDED") {
        setError(null);
        setConnectionId(ev.data.data.connection);
        queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
      } else if (ev.data?.eventType === "AUTHORIZATION_FAILED") {
        queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
        setError(ev.data.data.error || "An error occurred. Please try again.");
      }
    },
    [queryClient],
  );

  const startListening = useCallback(() => {
    if (listenerRef.current) return; // already listening
    const listener = (ev: MessageEvent) => handleMessage(ev);
    listenerRef.current = listener;
    window.addEventListener("message", listener);
    setIsListening(true);
  }, [handleMessage]);

  const stopListening = useCallback(() => {
    if (listenerRef.current) {
      window.removeEventListener("message", listenerRef.current);
      listenerRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        window.removeEventListener("message", listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, []);

  const getOAuthUrl = useCallback(async (): Promise<string | null> => {
    try {
      if (mode.type === "create") {
        const { params } = mode;
        const url = await createOauthUrl({
          connectOAuthParams: {
            provider: params.provider,
            consumerRef: params.consumerRef,
            groupRef: params.groupRef,
            projectId: projectIdOrName,
            consumerName: params.consumerName,
            groupName: params.groupName,
            providerWorkspaceRef: params.providerWorkspaceRef,
            providerMetadata: params.providerMetadata,
            enableCSRFProtection,
          },
        });
        return url ?? null;
      }

      const { params } = mode;
      const url = await updateOauthUrl({
        projectIdOrName,
        connectionId: params.connectionId,
      });
      return url ?? null;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err) || "An error occurred. Please try again.";
      setError(message);
      return null;
    }
  }, [mode, projectIdOrName, createOauthUrl, updateOauthUrl]);

  return {
    getOAuthUrl,
    isGeneratingUrl,
    startListening,
    stopListening,
    isListening,
    connectionId,
    error,
  };
}

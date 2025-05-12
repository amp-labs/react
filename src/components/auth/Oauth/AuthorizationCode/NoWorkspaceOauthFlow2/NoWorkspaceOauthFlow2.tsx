/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProject } from "src/context/ProjectContextProvider";
import { useCreateOauthConnectionMutation } from "src/hooks/mutation/useCreateOauthConnectionMutation";
import { useConnectionsListQuery } from "src/hooks/query/useConnectionsListQuery";
import { AMP_SERVER } from "src/services/api";

import { NoWorkspaceEntryContent } from "../NoWorkspaceEntry/NoWorkspaceEntryContent";
const DEFAULT_WIDTH = 600; // px
const DEFAULT_HEIGHT = 600; // px

/** Payload shape we expect from the popup */
type AuthEvent =
  | {
      eventType: "AUTHORIZATION_SUCCEEDED";
      data: { connection: string };
    }
  | {
      eventType: "AUTHORIZATION_FAILED";
      data: { error: string };
    };

interface NoWorkspaceOauthFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
}

/**
 * NoWorkspaceOauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function NoWorkspaceOauthFlow2({
  provider,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  providerName,
}: NoWorkspaceOauthFlowProps) {
  const { projectId } = useProject();
  const queryClient = useQueryClient();
  const popupRef = useRef<Window | null>(null);

  const {
    mutateAsync: createOauthConnectionUrlAsync,
    isPending: isCreatingOauthConnection,
  } = useCreateOauthConnectionMutation();

  const { isFetching: isConnectionsFetching, refetch: refetchConnections } =
    useConnectionsListQuery({
      groupRef,
      provider,
    });

  const [error, setError] = useState<string | null>(null);

  /** One‑time message listener (mount‑level) */
  useEffect(() => {
    const onMessage = (ev: MessageEvent<AuthEvent>) => {
      // Accept only events from *your* popup origin
      if (ev.origin !== AMP_SERVER) return;

      if (ev.data?.eventType === "AUTHORIZATION_SUCCEEDED") {
        setError(null);
        console.info("New connection:", ev.data.data.connection);
        // Refresh cached list so UI shows the new connection
        queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
      } else if (ev.data?.eventType === "AUTHORIZATION_FAILED") {
        console.error("OAuth failed:", ev.data.data.error);
        setError(ev.data.data.error || "An error occurred. Please try again.");
      }

      popupRef.current?.close();
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [queryClient]);

  const handleSubmit = async () => {
    setError(null);

    try {
      const { data: connections } = await refetchConnections();
      if (connections && connections.length > 0) {
        // first refetch connection before attempting to re-auth
        console.debug("connections found");
        return;
      }
    } catch {
      console.debug("no connections found");
    }

    try {
      const url = await createOauthConnectionUrlAsync({
        connectOAuthParams: {
          provider,
          consumerRef,
          groupRef,
          projectId,
          consumerName,
          groupName,
        },
      });

      if (url) {
        const left = window.screenX + (window.outerWidth - DEFAULT_WIDTH) / 2;
        const top =
          window.screenY + (window.outerHeight - DEFAULT_HEIGHT) / 2.5;
        const windowDimensions = `width=${DEFAULT_WIDTH},height=${DEFAULT_HEIGHT},left=${left},top=${top}`;
        popupRef.current = window.open(url, "OAuthPopup", windowDimensions);
      }
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : String(error) || "An error occurred. Please try again.",
      );
    }
  };

  return (
    <div>
      <NoWorkspaceEntryContent
        handleSubmit={handleSubmit}
        error={
          // hide error message when the connections are being fetched
          isCreatingOauthConnection ? "" : error
        }
        providerName={providerName}
        // disable button when loading or fetching connections
        isButtonDisabled={isCreatingOauthConnection || isConnectionsFetching}
      />
    </div>
  );
}

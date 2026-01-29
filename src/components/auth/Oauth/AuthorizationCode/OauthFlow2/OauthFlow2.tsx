/**
 * Unified OAuth flow component that handles both workspace and no-workspace cases
 * based on provider metadata fields.
 */

import { useEffect, useRef, useState } from "react";
import { MetadataItemInput } from "@generated/api/src";
import { useQueryClient } from "@tanstack/react-query";
import {
  isProviderMetadataValid,
  ProviderMetadata,
} from "src/components/auth/providerMetadata";
import { useCreateOauthConnectionMutation } from "src/hooks/mutation/useCreateOauthConnectionMutation";
import { useProjectQuery } from "src/hooks/query";
import { useConnectionsListQuery } from "src/hooks/query/useConnectionsListQuery";
import { AMP_SERVER } from "src/services/api";

import { enableCSRFProtection } from "../enableCSRFprotection";
import { NoWorkspaceEntryContent } from "../NoWorkspaceEntry/NoWorkspaceEntryContent";
import { WorkspaceEntryContent } from "../WorkspaceEntry/WorkspaceEntryContent";

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

interface OauthFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  metadataInputs: MetadataItemInput[];
  moduleError?: string | null;
}

/**
 * OauthFlow handles both workspace and no-workspace OAuth flows based on provider metadata.
 * For providers that require workspace/subdomain entry, it shows the appropriate form.
 * For providers that don't require workspace entry, it shows a simple next button.
 */
export function OauthFlow2({
  provider,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  providerName,
  metadataInputs,
  moduleError,
}: OauthFlowProps) {
  const { projectId } = useProjectQuery();
  const queryClient = useQueryClient();
  const popupRef = useRef<Window | null>(null);

  // error state - initialize with moduleError if present
  const [error, setError] = useState<string | null>(moduleError || null);

  // workspace and metadata states
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [metadata, setMetadata] = useState<ProviderMetadata>({});

  const {
    mutateAsync: createOauthConnectionUrlAsync,
    isPending: isCreatingOauthConnection,
  } = useCreateOauthConnectionMutation();

  const { isFetching: isConnectionsFetching, refetch: refetchConnections } =
    useConnectionsListQuery({
      groupRef,
      provider,
    });

  /** One‑time message listener (mount‑level) */
  useEffect(() => {
    const onMessage = (ev: MessageEvent<AuthEvent>) => {
      // Accept only events from *your* popup origin
      if (ev.origin !== AMP_SERVER) return;

      if (ev.data?.eventType === "AUTHORIZATION_SUCCEEDED") {
        setError(null);
        console.debug("New connection:", ev.data.data.connection);
        // Refresh cached list so UI shows the new connection
        queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
      } else if (ev.data?.eventType === "AUTHORIZATION_FAILED") {
        console.error("OAuth failed:", ev.data.data.error);
        queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
        setError(ev.data.data.error || "An error occurred. Please try again.");
      }
      popupRef.current?.close();
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [queryClient]);

  const handleFormDataChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setMetadata((prev) => ({ ...prev, [key]: { value, source: "input" } }));
  };

  const handleSubmit = async () => {
    setError(null);

    // Check for existing connections
    try {
      const { data: connections } = await refetchConnections();
      if (connections && connections.length > 0) {
        console.debug("connections found");
        return;
      }
    } catch {
      console.debug("error with fetching connections");
    }

    // Validate metadata fields if they exist
    if (
      metadataInputs.length > 0 &&
      !isProviderMetadataValid(metadataInputs, formData)
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const url = await createOauthConnectionUrlAsync({
        connectOAuthParams: {
          provider,
          consumerRef,
          groupRef,
          projectId: projectId || "", // todo - update to use projectIdOrName
          consumerName,
          groupName,
          providerWorkspaceRef: metadata?.workspace?.value,
          providerMetadata: metadata,
          enableCSRFProtection,
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

  // Determine which entry component to show based on provider and metadata
  const entryComponent = (() => {
    // If there are metadata fields, show the workspace entry form
    if (metadataInputs.length > 0) {
      return (
        <WorkspaceEntryContent
          handleSubmit={handleSubmit}
          setFormData={handleFormDataChange}
          error={error}
          isButtonDisabled={
            !isProviderMetadataValid(metadataInputs, formData) ||
            isCreatingOauthConnection ||
            isConnectionsFetching ||
            !!error
          }
          providerName={providerName}
          metadataInputs={metadataInputs}
        />
      );
    }

    // Default to no-workspace entry
    return (
      <NoWorkspaceEntryContent
        handleSubmit={handleSubmit}
        error={error}
        providerName={providerName}
        isButtonDisabled={
          isCreatingOauthConnection || isConnectionsFetching || !!error
        }
      />
    );
  })();

  return <div>{entryComponent}</div>;
}

/**
 * ProtectedInstallationContent - V2 simplified auth wrapper
 *
 * This component handles authentication before showing the installation UI.
 * Unlike V1's ProtectedConnectionLayout, this is simplified and uses headless hooks.
 *
 * Flow:
 * 1. Check if connection exists (using useConnection hook)
 * 2. If yes → show children (InstallationContentV2)
 * 3. If no → show appropriate auth flow based on provider type
 */

import { ReactNode } from "react";
import { Connection } from "services/api";
import { useInstallationProps } from "src/headless/InstallationProvider";
import { useConnection } from "src/headless/useConnection";
import { useProvider } from "src/hooks/useProvider";

import { ApiKeyAuthFlow } from "components/auth/ApiKeyAuth/ApiKeyAuthFlow";
import { BasicAuthFlow } from "components/auth/BasicAuth/BasicAuthFlow";
import { NoAuthFlow } from "components/auth/NoAuth/NoAuthFlow";
import { OauthFlow } from "components/auth/Oauth/OauthFlow/OauthFlow";

import { ComponentContainerLoading } from "../ComponentContainer";

interface ProtectedInstallationContentProps {
  children: ReactNode;
  onAuthSuccess?: (connection: Connection) => void;
}

/**
 * V2 Protected wrapper - simplified version of ProtectedConnectionLayout
 *
 * Key simplifications:
 * - Uses useConnection() hook instead of ConnectionsProvider context
 * - Uses useInstallationProps() for consumer/group info
 * - No resetComponent complexity
 * - No isIntegrationDeleted state (handled elsewhere)
 */
export function ProtectedInstallationContent({
  children,
  onAuthSuccess,
}: ProtectedInstallationContentProps) {
  // Get connection from headless hook
  const { connection, isPending: isConnectionPending } = useConnection();

  // Get installation context for consumer/group info
  const { consumerRef, consumerName, groupRef, groupName } =
    useInstallationProps();

  // Get provider info to determine auth type
  const {
    data: providerInfo,
    isLoading: isProviderLoading,
    isError: isProviderError,
    providerName,
    selectedProvider,
  } = useProvider(connection?.provider);

  // Show loading while fetching connection or provider info
  if (isConnectionPending || isProviderLoading) {
    return <ComponentContainerLoading />;
  }

  // Handle provider error
  if (isProviderError || !providerInfo) {
    throw new Error(
      `Failed to load provider information for connection "${connection?.provider}"`,
    );
  }

  // If connection exists, show the installation UI
  if (connection) {
    return <>{children}</>;
  }

  // No connection - show auth flow based on provider type
  const authFlowProps = {
    provider: selectedProvider,
    consumerRef,
    consumerName,
    groupRef,
    groupName,
    selectedConnection: connection || null, // Must be Connection | null
    setSelectedConnection: (conn: Connection | null) => {
      if (conn) {
        onAuthSuccess?.(conn);
      }
    },
    providerName,
    providerInfo,
  };

  // Render appropriate auth flow
  // Note: children must be JSX.Element for auth flows
  const childElement = children as JSX.Element;

  switch (providerInfo.authType) {
    case "none":
      return <NoAuthFlow {...authFlowProps}>{childElement}</NoAuthFlow>;

    case "basic":
      return <BasicAuthFlow {...authFlowProps}>{childElement}</BasicAuthFlow>;

    case "apiKey":
      return <ApiKeyAuthFlow {...authFlowProps}>{childElement}</ApiKeyAuthFlow>;

    case "oauth2":
      return <OauthFlow {...authFlowProps} />;

    default:
      // Default to OAuth for unknown types (including "oauth")
      return <OauthFlow {...authFlowProps} />;
  }
}

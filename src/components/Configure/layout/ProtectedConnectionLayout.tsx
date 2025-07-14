import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnections } from "context/ConnectionsContextProvider";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Connection, ProviderInfo, Integration } from "services/api";
import { SuccessTextBox } from "src/components/SuccessTextBox/SuccessTextBox";
import { Button } from "src/components/ui-base/Button";
import { handleServerError } from "src/utils/handleServerError";

import { ApiKeyAuthFlow } from "components/auth/ApiKeyAuth/ApiKeyAuthFlow";
import { BasicAuthFlow } from "components/auth/BasicAuth/BasicAuthFlow";
import { CustomAuthFlow } from "components/auth/CustomAuth/CustomAuthFlow";
import { NoAuthFlow } from "components/auth/NoAuth/NoAuthFlow";
import { OauthFlow } from "components/auth/Oauth/OauthFlow/OauthFlow";
import { useConnectionHandler } from "components/Connect/useConnectionHandler";

import { useProvider } from "../../../hooks/useProvider";
import {
  ComponentContainerError,
  ComponentContainerLoading,
} from "../ComponentContainer";

import { SHOW_CUSTOM_AUTH_TEST_DATA, testProviderInfo } from "./testdata";

/**
 * Determines the module to use based on provider configuration and integration settings
 * @param providerInfo Provider information containing module configuration
 * @param integrationObj Integration object that may override the default module
 * @returns The module to use, or undefined if no modules are configured
 * @throws Error if modules are configured but no default module is found
 */
function determineModule(
  providerInfo: ProviderInfo,
  integrationObj?: Integration | null
): string | undefined {
  // If there's more than one module, we need to figure out the current module
  // to understand which inputs to collect from the user.
  if (providerInfo.modules && Object.keys(providerInfo.modules).length > 0) {
    const module = integrationObj?.latestRevision?.content?.module || providerInfo.defaultModule;

    if (!module) {
      // This should never happen, but we'll throw an error if it does.
      throw new Error("Default module not found.");
    }

    return module;
  }

  return undefined;
}

interface ProtectedConnectionLayoutProps {
  provider?: string; // passed in from ConnectProvider Component
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  onSuccess?: (connection: Connection) => void;
  children: JSX.Element;
  onDisconnectSuccess?: (connection: Connection) => void;
  resetComponent: () => void; // resets installation integration component
}

export function ProtectedConnectionLayout({
  provider,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  children,
  onSuccess,
  onDisconnectSuccess,
  resetComponent,
}: ProtectedConnectionLayoutProps) {
  const {
    data: providerInfoData,
    isLoading: isProviderLoading,
    isError,
    error: providerInfoError,
    providerName,
    selectedProvider,
  } = useProvider(provider);
  const { provider: providerFromProps, isIntegrationDeleted, integrationObj } =
    useInstallIntegrationProps();
  const { selectedConnection, setSelectedConnection } = useConnections();
  useConnectionHandler({ onSuccess });
  const queryClient = useQueryClient();

  // TODO: delete when custom auth is implemented
  const providerInfo = SHOW_CUSTOM_AUTH_TEST_DATA
    ? testProviderInfo
    : providerInfoData;

  useEffect(() => {
    if (isError) {
      console.error("Error loading provider info.");
      handleServerError(providerInfoError);
    }
  }, [isError, providerInfoError]);

  const reinstallIntegration = useCallback(() => {
    queryClient.clear(); // clears all queries in react-query cache
    resetComponent();
  }, [resetComponent, queryClient]);

  if (!provider && !providerFromProps) {
    throw new Error(
      "ProtectedConnectionLayout must be given a provider prop or be used within InstallIntegrationProvider",
    );
  }

  // integration (and connection) was deleted, show success message with reinstall button
  if (isIntegrationDeleted) {
    return (
      <SuccessTextBox text="Integration successfully uninstalled.">
        <Button
          type="button"
          onClick={reinstallIntegration}
          style={{ width: "100%" }}
        >
          Reinstall Integration
        </Button>
      </SuccessTextBox>
    );
  }

  // a selected connection exists, render children
  if (selectedConnection) return children;

  if (isProviderLoading) return <ComponentContainerLoading />;

  if (providerInfo == null)
    return <ComponentContainerError message="Provider info was not found." />;

  let module: string | undefined;
  try {
    module = determineModule(providerInfo, integrationObj);
  } catch (error) {
    return <ComponentContainerError message={(error as Error).message} />;
  }

  // Filter metadata fields based on the module
  const getmetadataFields = () => {
    const metadataFields = providerInfo.metadata?.input || [];

    // If no module, show all fields
    if (!module) {
      return metadataFields;
    }

    // If module exists, only show fields that have dependencies for this module
    return metadataFields.filter(field =>
      field.moduleDependencies?.[module] // Only show if has dependency for this module
    );
  };

  const metadataFields = getmetadataFields();

  const sharedProps = {
    provider: selectedProvider,
    consumerRef,
    consumerName,
    groupRef,
    groupName,
    selectedConnection,
    setSelectedConnection,
    providerName,
    providerInfo,
    metadataFields,
    module,
    onDisconnectSuccess,
  };

  if (providerInfo.authType === "none") {
    return <NoAuthFlow {...sharedProps}>{children}</NoAuthFlow>;
  }

  if (providerInfo.authType === "basic") {
    return <BasicAuthFlow {...sharedProps}>{children}</BasicAuthFlow>;
  }

  if (providerInfo.authType === "apiKey") {
    return <ApiKeyAuthFlow {...sharedProps}>{children}</ApiKeyAuthFlow>;
  }

  if (providerInfo.authType === "custom") {
    return <CustomAuthFlow {...sharedProps}>{children}</CustomAuthFlow>;
  }

  return <OauthFlow {...sharedProps} />;
}

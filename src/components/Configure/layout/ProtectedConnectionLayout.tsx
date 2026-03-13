import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnections } from "context/ConnectionsContextProvider";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Connection } from "services/api";
import { SuccessTextBox } from "src/components/SuccessTextBox/SuccessTextBox";
import { Button } from "src/components/ui-base/Button";
import { handleServerError } from "src/utils/handleServerError";

import { ApiKeyAuthFlow } from "components/auth/ApiKeyAuth/ApiKeyAuthFlow";
import { BasicAuthFlow } from "components/auth/BasicAuth/BasicAuthFlow";
import { CustomAuthFlow } from "components/auth/CustomAuth/CustomAuthFlow";
import { NoAuthFlow } from "components/auth/NoAuth/NoAuthFlow";
import { OauthFlow } from "components/auth/Oauth/OauthFlow/OauthFlow";
import {
  determineModule,
  filterMetadataByModule,
  isConnectionMissingModuleMetadata,
  validateModuleProp,
} from "components/auth/providerMetadata";
import { UpdateConnectionMetadata } from "components/Connect/UpdateConnectionMetadata";
import { useConnectionHandler } from "components/Connect/useConnectionHandler";

import { useProvider } from "../../../hooks/useProvider";
import {
  ComponentContainerError,
  ComponentContainerLoading,
} from "../ComponentContainer";

import { SHOW_CUSTOM_AUTH_TEST_DATA, testProviderInfo } from "./testdata";

interface ProtectedConnectionLayoutProps {
  provider?: string; // passed in from ConnectProvider Component
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  module?: string; // passed in from ConnectProvider Component
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
  module: moduleProp,
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
  const {
    provider: providerFromProps,
    isIntegrationDeleted,
    integrationObj,
  } = useInstallIntegrationProps();
  const { selectedConnection, setSelectedConnection } = useConnections();
  useConnectionHandler({ onSuccess });
  const queryClient = useQueryClient();

  // TODO: delete when custom auth is implemented
  const providerInfo = SHOW_CUSTOM_AUTH_TEST_DATA
    ? testProviderInfo
    : providerInfoData;

  // Determine which module to use for filtering metadata:
  // - moduleProp (from ConnectProvider) takes priority over integration's module
  // - If provider has no modules → returns { module: "", error: null }
  // - If provider has modules → use the determined module or fall back to provider's defaultModule
  // - Returns error if provider has modules but no valid module can be determined
  const integrationModule =
    moduleProp || integrationObj?.latestRevision?.content?.module;
  const { module, error: moduleError } = determineModule(
    integrationModule,
    providerInfo,
  );

  // Filter metadata based on the determined module
  // - If module is "" (provider has no modules) → returns all fields for metadata collection.
  // - Otherwise → filters fields based on moduleDependencies
  const allMetadataFields = providerInfo?.metadata?.input || [];
  const filteredMetadataFields = filterMetadataByModule(
    allMetadataFields,
    module,
  );

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

  // Validate module prop against provider's available modules
  const moduleValidationError = validateModuleProp(moduleProp, providerInfo);

  // A connection exists - check if it has all the metadata needed for the module
  if (selectedConnection) {
    // Only check for missing module metadata when a module is explicitly provided
    // (via moduleProp from ConnectProvider or integrationModule from InstallIntegration).
    // Without an explicit module, just render children.
    if (integrationModule) {
      if (moduleValidationError) {
        return <ComponentContainerError message={moduleValidationError} />;
      }

      // Check if the connection is missing metadata required by the current module
      if (
        isConnectionMissingModuleMetadata(
          selectedConnection,
          filteredMetadataFields,
        )
      ) {
        return (
          <UpdateConnectionMetadata
            connection={selectedConnection}
            metadataInputs={filteredMetadataFields}
            providerName={providerName}
            onSuccess={() => {
              // Invalidate connections query to refetch with updated metadata
              queryClient.invalidateQueries({
                queryKey: ["amp", "connections"],
              });
            }}
          />
        );
      }
    }

    // Connection has all needed metadata, render children
    return children;
  }

  if (isProviderLoading) return <ComponentContainerLoading />;

  if (providerInfo == null)
    return <ComponentContainerError message="Provider info was not found." />;

  if (moduleValidationError) {
    return <ComponentContainerError message={moduleValidationError} />;
  }

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
    onDisconnectSuccess,
    metadataInputs: filteredMetadataFields,
    moduleError: moduleError || moduleValidationError,
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

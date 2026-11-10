import { useEffect, useRef } from "react";
import { useConnections } from "context/ConnectionsContextProvider";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import {
  CreateInstallationOperationRequest,
  HydratedRevision,
} from "services/api";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useCreateInstallationMutation } from "src/hooks/mutation/useCreateInstallationMutation";

import { getIsProxyEnabled } from "../../actions/proxy/isProxyEnabled";
import {
  ComponentContainerError,
  ComponentContainerLoading,
} from "../../ComponentContainer";
import { useHydratedRevision } from "../../state/HydratedRevisionContext";

import { InstalledSuccessBox } from "./InstalledSuccessBox";

// Reports whether the integration has no read or write objects for the consumer to configure.
const getNoConfigurationRequired = (
  hydratedRevision: HydratedRevision | null,
) => {
  const { read, write } = hydratedRevision?.content ?? {};
  return !read?.objects?.length && !write?.objects?.length;
};

interface ConditionalHasConfigurationLayoutProps {
  children: React.ReactNode;
}

/**
 * if the hydratedRevision only has proxy actions (or no configuration required),
 * then it will not render the ConfigureInstallation
 * @returns
 */
export function ConditionalHasConfigurationLayout({
  children,
}: ConditionalHasConfigurationLayoutProps) {
  const hasFiredMutationRef = useRef(false);
  const { projectIdOrName } = useAmpersandProviderProps();
  const { hydratedRevision, loading: hydratedRevisionLoading } =
    useHydratedRevision();
  const {
    integrationObj,
    installation,
    groupRef,
    consumerRef,
    onInstallSuccess,
    isIntegrationDeleted,
  } = useInstallIntegrationProps();

  const {
    mutate: createInstallation,
    isIdle: isCreateInstallationIdle,
    isPending: createInstallLoading,
    error: createInstallError,
    errorMsg: createInstallErrorMsg,
  } = useCreateInstallationMutation();

  const { selectedConnection, isConnectionsLoading } = useConnections();

  const isLoading =
    hydratedRevisionLoading || createInstallLoading || isConnectionsLoading;

  const provider = hydratedRevision?.content?.provider;
  const isConfigurationNotRequired: boolean =
    getNoConfigurationRequired(hydratedRevision);
  // This flow is not passed the subscribeEvents prop, so it has no subscribe config to install
  // a subscribe-only integration with.
  const isSubscribeOnly =
    isConfigurationNotRequired &&
    !!integrationObj?.latestRevision?.content?.subscribe?.objects?.length;

  useEffect(() => {
    if (
      !isLoading &&
      !isConnectionsLoading &&
      hydratedRevision &&
      isConfigurationNotRequired &&
      !isSubscribeOnly &&
      !installation &&
      selectedConnection &&
      integrationObj?.id &&
      !isIntegrationDeleted &&
      provider
    ) {
      const createInstallationRequest: CreateInstallationOperationRequest = {
        projectIdOrName,
        integrationId: integrationObj?.id,
        installation: {
          groupRef,
          connectionId: selectedConnection?.id,
          config: { content: { provider } },
        },
      };

      // if the integration has a proxy flag, add to request
      if (getIsProxyEnabled(hydratedRevision) === true) {
        createInstallationRequest.installation.config.content.proxy =
          hydratedRevision?.content?.proxy;
      }

      if (isCreateInstallationIdle && !hasFiredMutationRef.current) {
        createInstallation(createInstallationRequest, {
          onSuccess: (_installation) => {
            if (!hasFiredMutationRef.current) {
              onInstallSuccess?.(_installation?.id, _installation.config);
              hasFiredMutationRef.current = true; // only fire the mutation once
            }
          },
        });
      }
    }
  }, [
    hydratedRevision,
    isConfigurationNotRequired,
    installation,
    selectedConnection,
    projectIdOrName,
    integrationObj?.id,
    groupRef,
    consumerRef,
    isLoading,
    onInstallSuccess,
    isIntegrationDeleted,
    isConnectionsLoading,
    provider,
    createInstallation,
    isCreateInstallationIdle,
    isSubscribeOnly,
  ]);

  // if the integration has no configuration required, show the installed success box (proxy, subscribe-only)
  if (isConfigurationNotRequired && provider && installation)
    return <InstalledSuccessBox provider={provider} />;
  if (createInstallError)
    return (
      <ComponentContainerError
        message={createInstallErrorMsg ?? "Create installation failed"}
      />
    );
  if (!integrationObj)
    return (
      <ComponentContainerError message={"We can't load the integration"} />
    );
  if (isLoading) return <ComponentContainerLoading />;
  if (isSubscribeOnly && !installation)
    return (
      <ComponentContainerError message="This integration can't be set up here. Please contact your administrator." />
    );

  return <div>{children}</div>;
}

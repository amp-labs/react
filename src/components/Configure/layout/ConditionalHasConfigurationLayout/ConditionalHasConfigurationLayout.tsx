import { useEffect, useRef } from 'react';

import { useConnections } from 'context/ConnectionsContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { CreateInstallationOperationRequest, HydratedRevision } from 'services/api';
import { useCreateInstallationMutation } from 'src/hooks/mutation/useCreateInstallationMutation';

import { ComponentContainerError, ComponentContainerLoading } from '../../ComponentContainer';
import { useHydratedRevision } from '../../state/HydratedRevisionContext';

import { InstalledSuccessBox } from './InstalledSuccessBox';

// explicity check actions (i.e. read, write) to determine if configuration is required
// returns false if configuration is not required
const getNoConfigurationRequired = (hydratedRevision: HydratedRevision | null) => {
  const { read, write } = hydratedRevision?.content ?? {};
  return (!read && !write);
};

interface ConditionalHasConfigurationLayoutProps {
  children: React.ReactNode;
}

/**
 * if the hydratedRevision only has proxy actions (or no configuration required),
 * then it will not render the ConfigureInstallation
 * @returns
 */
export function ConditionalHasConfigurationLayout({ children }: ConditionalHasConfigurationLayoutProps) {
  const hasFiredMutationRef = useRef(false);
  const { projectId } = useProject();
  const { hydratedRevision, loading: hydratedRevisionLoading } = useHydratedRevision();
  const {
    integrationObj, installation, groupRef, consumerRef, onInstallSuccess,
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

  const isLoading = hydratedRevisionLoading || createInstallLoading || isConnectionsLoading;

  const provider = hydratedRevision?.content?.provider;
  const isConfigurationNotRequired: boolean = getNoConfigurationRequired(hydratedRevision);

  useEffect(() => {
    if (!isLoading && !isConnectionsLoading && hydratedRevision && isConfigurationNotRequired
      && !installation && selectedConnection && integrationObj?.id && !isIntegrationDeleted && provider) {
      const createInstallationRequest: CreateInstallationOperationRequest = {
        projectIdOrName: projectId,
        integrationId: integrationObj?.id,
        installation: {
          groupRef,
          connectionId: selectedConnection?.id,
          config: { content: { provider } },
        },
      };

      // if the integration has a proxy flag, add to request
      if (hydratedRevision?.content?.proxy?.enabled === true) {
        createInstallationRequest.installation.config.content.proxy = hydratedRevision?.content?.proxy;
      }

      if (isCreateInstallationIdle && !hasFiredMutationRef.current) {
        createInstallation(createInstallationRequest, {
          onSuccess: (_installation) => {
            onInstallSuccess?.(_installation?.id, _installation.config);
          },
        });
        hasFiredMutationRef.current = true; // only fire the mutation once
      }
    }
  }, [hydratedRevision, isConfigurationNotRequired, installation,
    selectedConnection, projectId, integrationObj?.id, groupRef, consumerRef,
    isLoading, onInstallSuccess, isIntegrationDeleted,
    isConnectionsLoading, provider, createInstallation, isCreateInstallationIdle]);

  // if the integration has no configuration required, show the installed success box (proxy, subscribe-only)
  if (isConfigurationNotRequired && provider && installation) return <InstalledSuccessBox provider={provider} />;
  if (createInstallError) return <ComponentContainerError message={createInstallErrorMsg ?? 'Create installation failed'} />;
  if (!integrationObj) return <ComponentContainerError message={"We can't load the integration"} />;
  if (isLoading) return <ComponentContainerLoading />;

  return (
    <div>
      {children}
    </div>
  );
}

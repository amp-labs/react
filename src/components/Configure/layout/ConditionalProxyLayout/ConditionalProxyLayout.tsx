import { useEffect, useState } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useConnections } from 'context/ConnectionsContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { HydratedRevision } from 'services/api';

import { onCreateInstallationProxyOnly } from '../../actions/proxy/onCreateInstallationProxyOnly';
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
  const { projectId } = useProject();
  const apiKey = useApiKey();
  const { hydratedRevision, loading: hydratedRevisionLoading } = useHydratedRevision();
  const {
    integrationObj, installation, groupRef, consumerRef, setInstallation, onInstallSuccess,
    isIntegrationDeleted,
  } = useInstallIntegrationProps();
  const { selectedConnection, isConnectionsLoading } = useConnections();
  const [createInstallLoading, setCreateInstallLoading] = useState(false);
  const isLoading = hydratedRevisionLoading || createInstallLoading || isConnectionsLoading;

  const provider = hydratedRevision?.content?.provider;
  const hasNoConfiguration: boolean = getNoConfigurationRequired(hydratedRevision);

  // basic error handling can be improved - i.e. show ui error
  const setError = (error: string) => {
    console.error('Error when creating proxy installation:', error);
  };

  useEffect(() => {
    if (!isLoading && !isConnectionsLoading && hydratedRevision && hasNoConfiguration
      && !installation && selectedConnection && apiKey && integrationObj?.id && !isIntegrationDeleted) {
      setCreateInstallLoading(true);

      onCreateInstallationProxyOnly({
        apiKey,
        projectId,
        integrationId: integrationObj?.id,
        groupRef,
        consumerRef,
        connectionId: selectedConnection?.id,
        hydratedRevision,
        setError,
        setInstallation,
        onInstallSuccess,
      }).then(() => {
        setCreateInstallLoading(false);
      }).catch((e) => {
        setCreateInstallLoading(false);
        console.error('Error when creating proxy installation:', e);
      });
    }
  }, [hydratedRevision,
    hasNoConfiguration, installation, selectedConnection, apiKey, projectId,
    integrationObj?.id, groupRef, consumerRef, setInstallation, isLoading, onInstallSuccess,
    isIntegrationDeleted, isConnectionsLoading]);

  if (!integrationObj) return <ComponentContainerError message={"We can't load the integration"} />;
  if (isLoading) return <ComponentContainerLoading />;

  // if the integration has no configuration required, show the installed success box (proxy, subscribe-only)
  if (hasNoConfiguration && provider && installation) return <InstalledSuccessBox provider={provider} />;

  return (
    <div>
      {children}
    </div>
  );
}

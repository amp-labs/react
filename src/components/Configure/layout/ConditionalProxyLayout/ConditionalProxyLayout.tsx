import { useEffect, useState } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useConnections } from 'context/ConnectionsContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { HydratedRevision } from 'services/api';
import { SuccessTextBox } from 'src/components/SuccessTextBox/SuccessTextBox';
import { Button } from 'src/components/ui-base/Button';

import { onCreateInstallationProxyOnly } from '../../actions/proxy/onCreateInstallationProxyOnly';
import { ComponentContainerError, ComponentContainerLoading } from '../../ComponentContainer';
import { useHydratedRevision } from '../../state/HydratedRevisionContext';

import { InstalledSuccessBox } from './InstalledSuccessBox';

// explicity check other actions (i.e. read, write) to determine if it's proxy only
// returns false if it's not proxy only or no hydratedRevision
const getIsProxyOnly = (hydratedRevision: HydratedRevision | null) => {
  const { read, write, proxy } = hydratedRevision?.content ?? {};
  return (!read && !write && proxy?.enabled) || false;
};

interface ConditionalProxyLayoutProps {
  children: React.ReactNode;
  resetComponent: () => void; // resets installation integration component
}

/**
 * if the hydratedRevision only has proxy actions,
 * then it will not render the ConfigureInstallation
 * @returns
 */
export function ConditionalProxyLayout({ children, resetComponent }: ConditionalProxyLayoutProps) {
  const { projectId } = useProject();
  const apiKey = useApiKey();
  const { hydratedRevision, loading: hydratedRevisionLoading } = useHydratedRevision();
  const {
    integrationObj, installation, groupRef, consumerRef, setInstallation, onInstallSuccess,
    isIntegrationDeleted,
  } = useInstallIntegrationProps();
  const { selectedConnection } = useConnections();
  const [createInstallLoading, setCreateInstallLoading] = useState(false);
  const isLoading = hydratedRevisionLoading || createInstallLoading;

  const provider = hydratedRevision?.content?.provider;
  const isProxyOnly: boolean = getIsProxyOnly(hydratedRevision);

  // basic error handling can be improved - i.e. show ui error
  const setError = (error: string) => {
    console.error('Error when creating proxy installation:', error);
  };

  useEffect(() => {
    if (!isLoading && hydratedRevision && isProxyOnly
      && !installation && selectedConnection && apiKey && integrationObj?.id) {
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
  }, [hydratedRevision, isProxyOnly, installation, selectedConnection, apiKey, projectId,
    integrationObj?.id, groupRef, consumerRef, setInstallation, isLoading, onInstallSuccess]);

  if (isIntegrationDeleted) {
    return (
      <SuccessTextBox
        text="Integration successfully uninstalled."
      >
        <Button
          type="button"
          onClick={resetComponent}
          style={{ width: '100%' }}
        >Reinstall Integration
        </Button>
      </SuccessTextBox>
    );
  }
  if (!integrationObj) return <ComponentContainerError message={"We can't load the integration"} />;
  if (isLoading) return <ComponentContainerLoading />;
  if (isProxyOnly && provider && installation) return <InstalledSuccessBox provider={provider} />;

  return (
    <div>
      {children}
    </div>
  );
}

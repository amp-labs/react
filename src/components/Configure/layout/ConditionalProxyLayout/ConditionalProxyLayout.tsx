import { useCallback, useState } from 'react';

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

  const onClickInstallProxy = useCallback(() => {
    setCreateInstallLoading(true);
    if (hydratedRevision && isProxyOnly && selectedConnection && apiKey && integrationObj?.id) {
      onCreateInstallationProxyOnly({
        apiKey,
        projectId,
        integrationId: integrationObj?.id || 'no integration id',
        groupRef,
        consumerRef,
        connectionId: selectedConnection?.id || 'no connection id',
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
    } else {
      // this should never happen as button should be disabled
      console.error('Error', {
        hydratedRevision, isProxyOnly, selectedConnection, apiKey, integrationObj,
      });
      setCreateInstallLoading(false);
    }
  }, [hydratedRevision, isProxyOnly, selectedConnection, apiKey,
    projectId, integrationObj, groupRef, consumerRef, setInstallation, onInstallSuccess]);

  const isClickInstallDisabled = !hydratedRevision || !selectedConnection || !apiKey || !integrationObj || isLoading;

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
  if (isProxyOnly && !installation) {
    return (
      <SuccessTextBox
        text="Connection successfull. "
      >
        <Button
          type="button"
          onClick={onClickInstallProxy}
          disabled={isClickInstallDisabled}
          style={{ width: '100%' }}
        >Install Integration
        </Button>
      </SuccessTextBox>
    );
  }
  if (isProxyOnly && provider && installation) return <InstalledSuccessBox provider={provider} />;

  return (
    <div>
      {children}
    </div>
  );
}

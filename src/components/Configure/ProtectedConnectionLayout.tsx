import { useEffect } from 'react';

import { PROVIDER_SALESFORCE } from '../../constants';
import { useConnections } from '../../context/ConnectionsContext';
import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { useConnectionHandler } from '../Connect/useConnectionHandler';
import { NoSubdomainOauthFlow } from '../Oauth/NoSubdomainEntry/NoSubdomainOauthFlow';
import { SalesforceOauthFlow } from '../Oauth/Salesforce/SalesforceOauthFlow';

interface ProtectedConnectionLayoutProps {
  provider?: string,
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  onSuccess?: (connectionID: string) => void;
  onError?: (error: string) => void;
  children: JSX.Element,
}
export function ProtectedConnectionLayout({
  provider, consumerRef, consumerName, groupRef, groupName, children, onSuccess, onError,
}: ProtectedConnectionLayoutProps) {
  const { provider: providerFromProps } = useInstallIntegrationProps();
  const { selectedConnection, setSelectedConnection, connections } = useConnections();
  useConnectionHandler({ onSuccess, onError });

  useEffect(() => {
    if (!selectedConnection && connections && connections.length > 0) {
      const [connection] = connections;
      setSelectedConnection(connection);
    }
  }, [connections, selectedConnection, setSelectedConnection]);

  if (!provider && !providerFromProps) {
    throw new Error('ProtectedConnectionLayout must be given a provider prop or be used within InstallIntegrationProvider');
  }
  // a selected connection exists, render children
  if (selectedConnection) return children;

  const selectedProvider = provider || providerFromProps;

  if (selectedProvider === PROVIDER_SALESFORCE) {
    return (
      <SalesforceOauthFlow
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      />
    );
  }

  return (
    <NoSubdomainOauthFlow
      provider={selectedProvider}
      consumerRef={consumerRef}
      consumerName={consumerName}
      groupRef={groupRef}
      groupName={groupName}
    />
  );
}

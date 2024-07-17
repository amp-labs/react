import { useEffect } from 'react';

import { useConnectionHandler } from 'components/Connect/useConnectionHandler';
import { OauthFlow } from 'components/Oauth/OauthFlow/OauthFlow';
import { useConnections } from 'context/ConnectionsContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';

interface ProtectedConnectionLayoutProps {
  provider?: string,
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  onSuccess?: (connectionID: string) => void;
  children: JSX.Element,
}

export function ProtectedConnectionLayout({
  provider, consumerRef, consumerName, groupRef, groupName, children, onSuccess,
}: ProtectedConnectionLayoutProps) {
  const { provider: providerFromProps } = useInstallIntegrationProps();
  const { selectedConnection, setSelectedConnection, connections } = useConnections();
  useConnectionHandler({ onSuccess });

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

  return (
    <OauthFlow
      provider={selectedProvider}
      consumerRef={consumerRef}
      consumerName={consumerName}
      groupRef={groupRef}
      groupName={groupName}
    />
  );
}

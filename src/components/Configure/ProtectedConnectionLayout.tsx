import { useEffect } from 'react';

import { PROVIDER_SALESFORCE } from '../../constants';
import { useConnections } from '../../context/ConnectionsContext';
import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import SalesforceOauthFlow from '../Salesforce/SalesforceOauthFlow';

interface ProtectedConnectionLayoutProps {
  provider: string,
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  children: JSX.Element,
}
export function ProtectedConnectionLayout({
  provider, consumerRef, consumerName, groupRef, groupName, children,
}: ProtectedConnectionLayoutProps) {
  const { selectedConnection, setSelectedConnection, connections } = useConnections();

  useEffect(() => {
    if (!selectedConnection && connections && connections.length > 0) {
      const [connection] = connections;
      setSelectedConnection(connection);
    }
  }, [connections, selectedConnection, setSelectedConnection]);

  // a selected connection exists, render children
  if (selectedConnection) return children;

  if (provider === PROVIDER_SALESFORCE) {
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
    <div>Unsupported provider</div>
  );
}

interface ProtectedInstallIntegrationLayoutProps {
  children: JSX.Element,
}

// If connection does not exist, render OAuth flow, otherwise render children.
export function ProtectedInstallIntegrationLayout(
  { children }: ProtectedInstallIntegrationLayoutProps,
) {
  const {
    consumerRef, consumerName, groupRef, groupName,
  } = useInstallIntegrationProps();

  // TODO: get the provider from the integration.
  return (
    <ProtectedConnectionLayout
      provider="salesforce"
      consumerRef={consumerRef}
      consumerName={consumerName}
      groupRef={groupRef}
      groupName={groupName}
    >
      {children}
    </ProtectedConnectionLayout>
  );
}

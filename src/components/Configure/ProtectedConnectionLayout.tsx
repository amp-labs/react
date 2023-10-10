import { useEffect } from 'react';

import { useConnections } from '../../context/ConnectionsContext';
import SalesforceOauthFlow from '../Salesforce/SalesforceOauthFlow';

interface ConfigureIntegrationBaseProps {
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  children: React.ReactNode,
}

// if connection does not exist, render SalesforceOauthFlow
export function ProtectedConnectionLayout({
  consumerRef, consumerName, groupRef, groupName, children,
}: ConfigureIntegrationBaseProps) {
  const { selectedConnection, setSelectedConnection, connections } = useConnections();

  useEffect(() => {
    if (!selectedConnection && connections && connections.length > 0) {
      const [connection] = connections;
      setSelectedConnection(connection);
    }
  }, [connections, selectedConnection, setSelectedConnection]);

  // a selected connection exists, render children
  if (selectedConnection) return children;

  // Require user to login to Saleforce if there are no connections yet.
  return (
    <SalesforceOauthFlow
      consumerRef={consumerRef}
      consumerName={consumerName}
      groupRef={groupRef}
      groupName={groupName}
    />
  );
}

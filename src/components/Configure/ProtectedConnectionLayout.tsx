import { useConnections } from '../../context/ConnectionsContext';
import SalesforceOauthFlow from '../Salesforce/SalesforceOauthFlow';

interface ConfigureIntegrationBaseProps {
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  children?: React.ReactNode,
}

// if connection does not exist, render SalesforceOauthFlow
export function ProtectedConnectionLayout({
  consumerRef, consumerName, groupRef, groupName, children,
}: ConfigureIntegrationBaseProps) {
  const { selectedConnection, setSelectedConnection, connections } = useConnections();

  // a selected connection exists, render children
  if (selectedConnection) return children;

  // if no selected connection exists, but a connections list exists; set selected connection
  if (connections && connections.length > 0) {
    // For now, the connections list for a particular groupRef + provider combo will be always be
    // an array of one.
    const [connection] = connections;
    // This will cause the component to re-render with the selected connection.
    setSelectedConnection(connection);
    return null;
  }

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

import { useConnections } from '../../context/ConnectionsContext';
import { useIntegrationList } from '../../context/IntegrationListContext';
import { Integration } from '../../services/api';
import {
  IntegrationConfig,
} from '../../types/configTypes';
import SalesforceOauthFlow from '../Salesforce/SalesforceOauthFlow';

import { ErrorTextBoxPlaceholder } from './ErrorTextBoxPlaceholder';

interface ConfigureIntegrationBaseProps {
  integration: string, // integrationName
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  integrationObj: Integration | null,
  userConfig?: IntegrationConfig,
}

// Base component for configuring and reconfiguring an integration.
export function ConfigureIntegrationBase({
  integration, consumerRef, consumerName, groupRef, groupName, integrationObj, userConfig,
}: ConfigureIntegrationBaseProps) {
  const { selectedConnection, setSelectedConnection, connections } = useConnections();
  const { integrations } = useIntegrationList();

  if (!integrations || !integrations.length || !integration) {
    return <ErrorTextBoxPlaceholder />;
  }

  if (!integrationObj) {
    return <ErrorTextBoxPlaceholder />;
  }

  // no installation, but a connection exists
  if (selectedConnection) {
    return (
      <div>
        'SetUpRead with Connection ID {selectedConnection.id} and
        workspaceRef {selectedConnection.providerWorkspaceRef}
      </div>
    );
  }

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

import { useConnectionsList } from '../../context/ConnectionsListContext';
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
  const { connections } = useConnectionsList();
  const { integrations } = useIntegrationList();

  if (!integrations || !integrations.length || !integration) {
    return <ErrorTextBoxPlaceholder />;
  }

  if (!integrationObj) {
    return <ErrorTextBoxPlaceholder />;
  }

  if (!connections || connections.length === 0) {
    // require user to login to Saleforce if no connection is established
    return (
      <SalesforceOauthFlow
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      />
    );
  }
  const connection = connections[0];
  return (
    <div>SetUpRead with Connection ID {connection.id} and workspaceRef {connection.providerWorkspaceRef}</div>

  // TODO: update SetupRead to use hydrated revision
  // <SetUpRead
  //   integration={integration}
  //   source={integrationObj}
  //   subdomain={subdomain}
  //   appName={appName}
  //   userConfig={userConfig}
  //   api={provider}
  //   userId={userId}
  //   groupId={groupId}
  //   redirectUrl={redirectUrl}
  // />
  );
}

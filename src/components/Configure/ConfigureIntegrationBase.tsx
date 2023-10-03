import { useConnectionsList } from '../../context/ConnectionsListContext';
import { useIntegrationList } from '../../context/IntegrationListContext';
// import { useSubdomain } from '../../context/SubdomainProvider';
import {
  IntegrationConfig,
} from '../../types/configTypes';
import { findIntegrationFromList } from '../../utils';
import SalesforceOauthFlow from '../Salesforce/SalesforceOauthFlow';

import { ErrorTextBoxPlaceholder } from './ErrorTextBoxPlaceholder';
// import { SetUpRead } from './SetupRead';

interface ConfigureIntegrationBaseProps {
  integration: string, // integrationName
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  userConfig?: IntegrationConfig,
}

// Base component for configuring and reconfiguring an integration.
export function ConfigureIntegrationBase({
  integration, consumerRef, consumerName, groupRef, groupName, userConfig,
}: ConfigureIntegrationBaseProps) {
  const { connections } = useConnectionsList();
  const { integrations } = useIntegrationList();

  if (!integrations || !integrations.length || !integration) {
    return <ErrorTextBoxPlaceholder />;
  }

  const integrationObj = findIntegrationFromList(integration, integrations);

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

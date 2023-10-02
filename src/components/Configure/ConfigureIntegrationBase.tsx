import { useIntegrationList } from '../../context/IntegrationListContext';
import { useProviderConnection } from '../../context/ProviderConnectionContext';
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
  const { isConnectedToProvider } = useProviderConnection();
  const { integrations } = useIntegrationList();
  // const { subdomain } = useSubdomain();

  if (!integrations || !integrations.length || !integration) {
    return <ErrorTextBoxPlaceholder />;
  }

  const integrationObj = findIntegrationFromList(integration, integrations);

  if (!integrationObj) {
    return <ErrorTextBoxPlaceholder />;
  }

  // const appName = integrationObj?.name || '';
  const provider = integrationObj?.provider || '';

  //  TODO: isConnectedToProvider should be an API call
  if (!isConnectedToProvider[provider]) {
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

  return (
    <div>SetUpRead</div>

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

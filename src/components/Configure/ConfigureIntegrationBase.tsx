import { useIntegrationList } from '../../context/IntegrationListContext';
import { useProviderConnection } from '../../context/ProviderConnectionContext';
// import { useSubdomain } from '../../context/SubdomainProvider';
import {
  IntegrationConfig,
} from '../../types/configTypes';
import { findIntegrationFromList } from '../../utils';
import CenteredTextBox from '../CenteredTextBox/CenteredTextBox';
import SalesforceOauthFlow from '../Salesforce/SalesforceOauthFlow';

// import { SetUpRead } from './SetupRead';

function SetUpWrite(/* props: InstallProps */) {
  return (<>TODO</>);
}

interface ConfigureIntegrationBaseProps {
  integration: string, // integrationName
  userId: string,
  groupId: string,
  userConfig?: IntegrationConfig,
}

// Base component for configuring and reconfiguring an integration.
export function ConfigureIntegrationBase({
  integration, userId, groupId, userConfig,
}: ConfigureIntegrationBaseProps) {
  const { isConnectedToProvider } = useProviderConnection();
  const { integrations } = useIntegrationList();
  // const { subdomain } = useSubdomain();

  if (!integrations) {
    return <CenteredTextBox text="We can't load the integration" />;
  }

  const integrationObj = findIntegrationFromList(integration, integrations);

  if (!integration) {
    return <CenteredTextBox text="We can't load the integration" />;
  }

  // const appName = integrationObj?.name || '';
  const provider = integrationObj?.provider || '';

  //  TODO: isConnectedToProvider should be an API call
  if (!isConnectedToProvider[provider]) {
    return (
      <SalesforceOauthFlow
        userId={userId}
        groupId={groupId}
      />
    );
  }

  // todo fetch this from somewhere.
  const type = 'read';
  // const { type } = source;
  if (type === 'read') {
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
  } if (type === 'write') {
    return <SetUpWrite />;
  }
  return null;
}

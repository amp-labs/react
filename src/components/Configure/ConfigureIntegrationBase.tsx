import { useEffect } from 'react';

import { useProviderConnection } from '../../context/ProviderConnectionContext';
import { useSourceList } from '../../context/SourceListContext';
import { useSubdomain } from '../../context/SubdomainProvider';
import {
  IntegrationConfig,
} from '../../types/configTypes';
import { findSourceFromList } from '../../utils';
import CenteredTextBox from '../CenteredTextBox/CenteredTextBox';
import SalesforceOauthFlow from '../Salesforce/SalesforceOauthFlow';

import { SetUpRead } from './SetupRead';

function SetUpWrite(/* props: InstallProps */) {
  return (<>TODO</>);
}

interface ConfigureIntegrationBaseProps {
  integration: string,
  userId: string,
  groupId: string,
  userConfig?: IntegrationConfig,
  redirectUrl?: string,
}

// Base component for configuring and reconfiguring an integration.
export function ConfigureIntegrationBase({
  integration, userId, groupId, userConfig, redirectUrl,
}: ConfigureIntegrationBaseProps) {
  const { isConnectedToProvider } = useProviderConnection();
  const { sources } = useSourceList();
  const { subdomain } = useSubdomain();

  if (!sources) {
    return <CenteredTextBox text="We can't load the integration" />;
  }
  const source = findSourceFromList(integration, sources);

  if (!source) {
    return <CenteredTextBox text="We can't load the integration" />;
  }

  const appName = sources?.appName || '';
  const api = source?.api || '';

  //  TODO: isConnectedToProvider should be an API call
  if (!isConnectedToProvider[api]) {
    return (
      <SalesforceOauthFlow
        userId={userId}
        groupId={groupId}
      />
    );
  }

  const { type } = source;
  if (type === 'read') {
    return (
      <SetUpRead
        integration={integration}
        source={source}
        subdomain={subdomain}
        appName={appName}
        userConfig={userConfig}
        api={api}
        userId={userId}
        groupId={groupId}
        redirectUrl={redirectUrl}
      />
    );
  } if (type === 'write') {
    return <SetUpWrite />;
  }
  return null;
}

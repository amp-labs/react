import {
  useContext,
} from 'react';

import { useProviderConnection } from '../../context/ProviderConnectionContext';
import {
  IntegrationConfig,
  SourceList,
} from '../../types/configTypes';
import { findSourceFromList } from '../../utils';
import { SourceListContext, SubdomainContext } from '../AmpersandProvider/AmpersandProvider';
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
  const { subdomain } = useContext(SubdomainContext);

  const sourceList: SourceList | null = useContext(SourceListContext);
  let source;
  let appName = 'this app';

  if (sourceList) {
    source = findSourceFromList(integration, sourceList);
    appName = sourceList.appName;
  }

  if (!source) {
    return <CenteredTextBox text="We can't load the integration" />;
  }
  const { api } = source;

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

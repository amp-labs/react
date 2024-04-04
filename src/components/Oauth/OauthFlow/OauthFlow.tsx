import { useEffect, useState } from 'react';

import { PROVIDER_SALESFORCE } from '../../../constants';
import { useApiKey } from '../../../context/ApiKeyContextProvider';
import { api, ProviderInfo } from '../../../services/api';
import { NoWorkspaceOauthFlow } from '../NoWorkspaceEntry/NoWorkspaceOauthFlow';
import { SalesforceOauthFlow } from '../Salesforce/SalesforceOauthFlow';
import { WorkspaceOauthFlow } from '../WorkspaceEntry/WorkspaceOauthFlow';

const GENERIC_WORKSPACE_FEATURE_FLAG = false;

type OauthFlowProps = {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
};

export function OauthFlow({
  provider, consumerRef, consumerName, groupRef, groupName,
}: OauthFlowProps) {
  const apiKey = useApiKey();
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);

  useEffect(() => {
    if (provider && api) {
      api().providerApi.getProvider({ provider }, {
        headers: { 'X-Api-Key': apiKey ?? '' },
      }).then((_providerInfo) => {
        setProviderInfo(_providerInfo);
      }).catch((err) => {
        console.error('Error loading provider info: ', err);
      });
    }
  }, [apiKey, provider]);

  const workspaceRequired = providerInfo?.oauthOpts?.explicitWorkspaceRequired ?? false;

  // custom logic for Salesforce
  if (provider === PROVIDER_SALESFORCE && !GENERIC_WORKSPACE_FEATURE_FLAG) {
    return (
      <SalesforceOauthFlow
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      />
    );
  }

  // generic required workspace
  if (GENERIC_WORKSPACE_FEATURE_FLAG && workspaceRequired) {
    return (
      <WorkspaceOauthFlow
        provider={provider}
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      />
    );
  }

  // no workspace required
  return (
    <NoWorkspaceOauthFlow
      provider={provider}
      consumerRef={consumerRef}
      consumerName={consumerName}
      groupRef={groupRef}
      groupName={groupName}
    />
  );
}

import { useEffect, useState } from 'react';

import { useApiKey } from '../../../context/ApiKeyContextProvider';
import { api, ProviderInfo } from '../../../services/api';
import { NoWorkspaceOauthFlow } from '../NoWorkspaceEntry/NoWorkspaceOauthFlow';
import { WorkspaceOauthFlow } from '../WorkspaceEntry/WorkspaceOauthFlow';

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

  const workspaceRequired = providerInfo?.oauth2Opts?.explicitWorkspaceRequired ?? false;

  // required workspace
  if (workspaceRequired) {
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

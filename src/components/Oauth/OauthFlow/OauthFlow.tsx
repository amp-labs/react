import { ProviderInfo } from 'services/api';

import { NoWorkspaceOauthFlow } from '../NoWorkspaceEntry/NoWorkspaceOauthFlow';
import { WorkspaceOauthFlow } from '../WorkspaceEntry/WorkspaceOauthFlow';

type OauthFlowProps = {
  provider: string;
  providerInfo: ProviderInfo;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
};

export function OauthFlow({
  provider, providerInfo, consumerRef, consumerName, groupRef, groupName,
}: OauthFlowProps) {
  if (providerInfo.oauth2Opts === undefined) {
    return <>Provider is missing OAuth2 options</>;
  }

  const { grantType } = providerInfo.oauth2Opts;
  const workspaceRequired = providerInfo.oauth2Opts.explicitWorkspaceRequired;

  if (grantType === 'authorizationCode') {
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

  if (grantType === 'clientCredentials') {
    return <>Client credentials flow not supported yet</>;
  }

  if (grantType === 'password') {
    return <>Password flow not supported yet</>;
  }

  if (grantType === 'PKCE') {
    return <>PKCE flow not supported yet</>;
  }

  return <>Unsupported grant type: {grantType}</>;
}

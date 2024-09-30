import { Connection, ProviderInfo } from 'services/api';
import { getProviderName } from 'src/utils';

import { NoWorkspaceOauthFlow } from '../AuthorizationCode/NoWorkspaceEntry/NoWorkspaceOauthFlow';
import { WorkspaceOauthFlow } from '../AuthorizationCode/WorkspaceEntry/WorkspaceOauthFlow';
import { NoWorkspaceOauthClientCredsFlow } from '../ClientCredentials/NoWorkspaceOauthClientCredsFlow';
import { WorkspaceOauthClientCredsFlow } from '../ClientCredentials/WorkspaceOauthClientCredsFlow';

const AUTHORIZATION_CODE = 'authorizationCode';
const CLIENT_CREDENTIALS = 'clientCredentials';

type OauthFlowProps = {
  provider: string;
  providerInfo: ProviderInfo;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
};

export function OauthFlow({
  provider, providerInfo, consumerRef, consumerName, groupRef, groupName, selectedConnection, setSelectedConnection,
}: OauthFlowProps) {
  if (providerInfo.oauth2Opts === undefined) {
    return <em>Provider is missing OAuth2 options</em>;
  }

  const { grantType, explicitScopesRequired, explicitWorkspaceRequired } = providerInfo.oauth2Opts;
  const providerName = getProviderName(provider, providerInfo);

  if (grantType === AUTHORIZATION_CODE) {
    // required workspace
    if (explicitWorkspaceRequired) {
      return (
        <WorkspaceOauthFlow
          provider={provider}
          consumerRef={consumerRef}
          consumerName={consumerName}
          groupRef={groupRef}
          groupName={groupName}
          providerName={providerName}
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
        providerName={providerName}
      />
    );
  }

  if (grantType === CLIENT_CREDENTIALS) {
    if (explicitWorkspaceRequired) {
      return (
        <WorkspaceOauthClientCredsFlow
          provider={provider}
          consumerRef={consumerRef}
          consumerName={consumerName}
          groupRef={groupRef}
          groupName={groupName}
          explicitScopesRequired={explicitScopesRequired}
          setSelectedConnection={setSelectedConnection}
          selectedConnection={selectedConnection}
          providerName={providerName}
        />
      );
    }

    return (
      <NoWorkspaceOauthClientCredsFlow
        provider={provider}
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
        explicitScopesRequired={explicitScopesRequired}
        setSelectedConnection={setSelectedConnection}
        selectedConnection={selectedConnection}
        providerName={providerName}
      />
    );
  }

  if (grantType === 'password') {
    return <em>Password flow not supported yet</em>;
  }

  if (grantType === 'PKCE') {
    return <em>PKCE flow not supported yet</em>;
  }

  return <em>Unsupported grant type: {grantType}</em>;
}

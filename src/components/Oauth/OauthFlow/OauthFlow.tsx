import {
  NoWorkspaceOauthClientCredsFlow,
} from 'components/Oauth/NoWorkspaceEntry/NoWorkspaceOauthClientCredsFlow';
import { NoWorkspaceOauthFlow } from 'components/Oauth/NoWorkspaceEntry/NoWorkspaceOauthFlow';
import {
  WorkspaceOauthClientCredsFlow,
} from 'components/Oauth/WorkspaceEntry/WorkspaceOauthClientCredsFlow';
import { WorkspaceOauthFlow } from 'components/Oauth/WorkspaceEntry/WorkspaceOauthFlow';
import { Connection, ProviderInfo } from 'services/api';

type OauthFlowProps = {
  provider: string;
  providerInfo: ProviderInfo;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  setSelectedConnection: (connection: Connection) => void;
};

export function OauthFlow({
  provider, providerInfo, consumerRef, consumerName, groupRef, groupName, setSelectedConnection,
}: OauthFlowProps) {
  if (providerInfo.oauth2Opts === undefined) {
    return <em>Provider is missing OAuth2 options</em>;
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
    if (workspaceRequired) {
      return (
        <WorkspaceOauthClientCredsFlow
          provider={provider}
          consumerRef={consumerRef}
          consumerName={consumerName}
          groupRef={groupRef}
          groupName={groupName}
          setSelectedConnection={setSelectedConnection}
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
        setSelectedConnection={setSelectedConnection}
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

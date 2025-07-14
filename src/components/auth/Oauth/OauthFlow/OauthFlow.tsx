import { Connection, ProviderInfo } from "services/api";
import { MetadataItemInput } from "@generated/api/src";
import { useProvider } from "src/hooks/useProvider";

import { OauthFlow2 } from "../AuthorizationCode/OauthFlow2/OauthFlow2";
import { ClientCredentials } from "../ClientCredentials/ClientCredentials";

const AUTHORIZATION_CODE = "authorizationCode";
const AUTHORIZATION_CODE_PKCE = "authorizationCodePKCE";
const CLIENT_CREDENTIALS = "clientCredentials";

type OauthFlowProps = {
  provider: string;
  providerInfo: ProviderInfo;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
  metadataFields: MetadataItemInput[];
};

export function OauthFlow({
  provider,
  providerInfo,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  selectedConnection,
  setSelectedConnection,
  metadataFields,
}: OauthFlowProps) {
  const { providerName } = useProvider(provider);
  if (providerInfo.oauth2Opts === undefined) {
    return <em>Provider is missing OAuth2 options</em>;
  }

  const { grantType, explicitScopesRequired } = providerInfo.oauth2Opts;

  const sharedProps = {
    provider,
    consumerRef,
    consumerName,
    groupRef,
    groupName,
    providerName,
    metadataFields,
  };

  if (
    grantType === AUTHORIZATION_CODE ||
    grantType === AUTHORIZATION_CODE_PKCE
  ) {
    // if some metadata is required, we reuse the workspace oauth flow for now.
    // Combine WorkspaceOauthFlow and NoWorkspaceOauthFlow into a single flow.
    return <OauthFlow2 {...sharedProps} />;
  }

  if (grantType === CLIENT_CREDENTIALS) {
    return (
      <ClientCredentials
        {...sharedProps}
        explicitScopesRequired={explicitScopesRequired}
        selectedConnection={selectedConnection}
        setSelectedConnection={setSelectedConnection}
      />
    );
  }

  if (grantType === "password") {
    return <em>Password flow not supported yet</em>;
  }

  return <em>Unsupported grant type: {grantType}</em>;
}

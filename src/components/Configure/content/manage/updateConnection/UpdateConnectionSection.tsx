import { AuthType, Oauth2OptsGrantTypeEnum } from '@generated/api/src';

import { useProviderInfoQuery } from 'src/hooks/useProvider';

import { UpdateApiKeyConnect } from './UpdateApiKeyConnect';
import { UpdateBasicAuthConnect } from './UpdateBasicAuthConnect';
import { UpdateClientCredentialsConnect } from './UpdateClientCredentialsConnect';
import { UpdateOauthConnect } from './UpdateOauthConnect';

/**
 *
 * @param provider is provided directly for ConnectProvider component
 * @returns
 */
export function UpdateConnectionSection({ provider }: { provider?: string }) {
  const { data: providerInfo } = useProviderInfoQuery(provider);

  if (providerInfo?.authType === AuthType.Basic) {
    return <UpdateBasicAuthConnect provider={provider} />;
  }

  if (providerInfo?.authType === AuthType.ApiKey) {
    return <UpdateApiKeyConnect provider={provider} />;
  }

  // if oauth2 and supported grant type, oauth update connection
  const oAuthGrantType = providerInfo?.oauth2Opts?.grantType;
  if (oAuthGrantType) {
    if (oAuthGrantType === Oauth2OptsGrantTypeEnum.AuthorizationCode
       || oAuthGrantType === Oauth2OptsGrantTypeEnum.AuthorizationCodePkce) {
      return <UpdateOauthConnect provider={provider} />;
    }

    if (oAuthGrantType === Oauth2OptsGrantTypeEnum.ClientCredentials) {
      return <UpdateClientCredentialsConnect provider={provider} />;
    }
  }

  return null;
}

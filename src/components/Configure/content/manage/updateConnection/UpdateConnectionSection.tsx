import { AuthType, Oauth2OptsGrantTypeEnum } from '@generated/api/src';

import { useProviderInfoQuery } from 'src/hooks/useProvider';

import { UpdateApiKeyConnect } from './updateApiKeyConnect';
import { UpdateClientCredentialsConnect } from './UpdateClientCredentialsConnect';
import { UpdateOauthConnect } from './UpdateOauthConnect';

export function UpdateConnectionSection() {
  const { data: providerInfo } = useProviderInfoQuery();

  if (providerInfo?.authType === AuthType.Basic) {
    // placeholder basic auth
  }

  if (providerInfo?.authType === AuthType.ApiKey) {
    return <UpdateApiKeyConnect />;
  }

  // if oauth2 and supported grant type, oauth update connection
  const oAuthGrantType = providerInfo?.oauth2Opts?.grantType;
  if (oAuthGrantType) {
    if (oAuthGrantType === Oauth2OptsGrantTypeEnum.AuthorizationCode
       || oAuthGrantType === Oauth2OptsGrantTypeEnum.AuthorizationCodePkce) {
      return <UpdateOauthConnect />;
    }

    if (oAuthGrantType === Oauth2OptsGrantTypeEnum.ClientCredentials) {
      return <UpdateClientCredentialsConnect />;
    }
  }

  return null;
}

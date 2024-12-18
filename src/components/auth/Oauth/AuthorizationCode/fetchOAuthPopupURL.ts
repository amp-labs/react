import { api, OauthConnectOperationRequest, ProviderApp } from 'services/api';
import { getEnvVariable, getProviderName } from 'src/utils';

const VITE_ENABLE_CSRF = getEnvVariable('VITE_AMP_ENABLE_CSRF', false);
const NEXT_ENABLE_CSRF = getEnvVariable('NEXT_AMP_ENABLE_CSRF', false);
const REACT_APP_ENABLE_CSRF = getEnvVariable('REACT_APP_AMP_ENABLE_CSRF', false);

const enableCSRFProtection = !!VITE_ENABLE_CSRF || !!NEXT_ENABLE_CSRF || !!REACT_APP_ENABLE_CSRF;

export const fetchOAuthPopupURL = async (
  projectId: string,
  consumerRef: string,
  groupRef: string,
  apiKey: string,
  provider: string,
  workspace?: string,
  consumerName?: string,
  groupName?: string,
): Promise<string> => {
  const provInfo = await api().providerApi.getProvider({ provider }, {
    headers: { 'X-Api-Key': apiKey ?? '' },
  });
  if (!provInfo) {
    throw new Error(`Provider ${provider} not found`);
  }

  if (provInfo.authType === 'oauth2') {
    if (provInfo.oauth2Opts?.grantType === 'authorizationCode'
      || provInfo.oauth2Opts?.grantType === 'authorizationCodePKCE') {
      const providerApps = await api().providerAppApi.listProviderApps({ projectIdOrName: projectId }, {
        headers: { 'X-Api-Key': apiKey ?? '' },
      });

      const app = providerApps.find((a: ProviderApp) => a.provider === provider);
      const providerName = getProviderName(provider, provInfo);

      if (!app) {
        throw new Error(`You must first set up a ${providerName} Provider App using the Ampersand Console.`);
      }

      const request: OauthConnectOperationRequest = {
        connectOAuthParams: {
          providerWorkspaceRef: workspace,
          projectId,
          groupRef,
          groupName,
          consumerRef,
          consumerName,
          providerAppId: app.id,
          provider,
          enableCSRFProtection,
        },
      };

      const url = await api().oAuthApi.oauthConnect(request, {
        credentials: 'include',
        headers: { 'X-Api-Key': apiKey ?? '', 'Content-Type': 'application/json' },
      });
      return url;
    }
  }

  throw new Error(`Provider ${provider} does not support an OAuth2 web flow.`);
};

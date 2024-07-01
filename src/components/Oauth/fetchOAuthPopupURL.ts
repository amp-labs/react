import { api, OauthConnectOperationRequest, ProviderApp } from '../../services/api';
import { capitalize } from '../../utils';

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
  const providerApps = await api().providerAppApi.listProviderApps({ projectIdOrName: projectId }, {
    headers: { 'X-Api-Key': apiKey ?? '' },
  });
  const app = providerApps.find((a: ProviderApp) => a.provider === provider);

  if (!app) {
    throw new Error(`You must first set up a ${capitalize(provider)} Provider App using the Ampersand Console.`);
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
    },
  };

  const url = await api().oAuthApi.oauthConnect(request);
  return url;
};

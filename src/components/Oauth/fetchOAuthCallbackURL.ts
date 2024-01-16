import { api, ProviderApp } from '../../services/api';
import { capitalize } from '../../utils';

export const fetchOAuthCallbackURL = async (
  projectId: string,
  consumerRef: string,
  groupRef: string,
  consumerName: string,
  groupName: string,
  apiKey: string,
  provider: string,
  workspace?: string,
): Promise<string> => {
  const providerApps = await api().providerAppApi.listProviderApps({ projectId }, {
    headers: { 'X-Api-Key': apiKey ?? '' },
  });
  const app = providerApps.find((a: ProviderApp) => a.provider === provider);

  if (!app) {
    throw new Error(`You must first set up a ${capitalize(provider)} Connected App using the Ampersand Console.`);
  }

  const url = await api().oAuthApi.oauthConnect({
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
  });
  return url;
};

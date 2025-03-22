import { useQuery } from '@tanstack/react-query';

import { useAPI } from 'services/api';
import { useInstallIntegrationProps } from
  'src/context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { getProviderName } from 'src/utils';

export const useProviderInfoQuery = (provider?: string) => {
  const getAPI = useAPI();
  const { provider: providerFromProps } = useInstallIntegrationProps();
  const selectedProvider = provider || providerFromProps;

  return useQuery({
    queryKey: ['amp', 'providerInfo', selectedProvider],
    queryFn: async () => {
      if (!selectedProvider) {
        throw new Error('Provider not found');
      }
      const api = await getAPI();
      return api.providerApi.getProvider({ provider: selectedProvider });
    },
    enabled: !!selectedProvider,
  });
};

/**
 * Extends useProviderInfoQuery (react-query) to include derived providerName and selectedProvider
 * optional provider prop is used when passed in from ConnectProvider Component
 * @param provider
 * @returns
 */
export const useProvider = (provider?: string) => {
  const providerInfoQuery = useProviderInfoQuery(provider);
  const { data: providerInfo } = providerInfoQuery;
  const { provider: providerFromProps } = useInstallIntegrationProps();
  const providerName = (providerInfo) && getProviderName(providerInfo?.name, providerInfo);

  // passed in from ConnectProvider Component or from installation provider info
  const selectedProvider = provider || providerFromProps;

  return {
    ...providerInfoQuery, // react query data
    providerName,
    selectedProvider,
  };
};

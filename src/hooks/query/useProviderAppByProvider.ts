import { useListProviderAppsQuery } from "./useListProviderAppsQuery";

export const useProviderAppByProvider = (provider?: string) => {
  const { data, ...rest } = useListProviderAppsQuery();
  const providerApp = provider
    ? data?.find((app) => app.provider === provider)
    : undefined;
  return { providerApp, ...rest };
};

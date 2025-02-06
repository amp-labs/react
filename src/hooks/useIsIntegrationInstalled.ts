import { useEffect } from 'react';

import { handleServerError } from 'src/utils/handleServerError';

import { useListInstallationsQuery } from './query/useListInstallationsQuery';

interface UseIsIntegrationInstalledResult {
  isLoading: boolean;
  isLoaded: boolean;
  isIntegrationInstalled: boolean | null;
}

export const useIsIntegrationInstalled = (
  integration: string,
  groupRef: string,
): UseIsIntegrationInstalledResult => {
  const {
    data: installations, isLoading: isInstallationLoading, isError, error,
  } = useListInstallationsQuery(integration, groupRef);

  const isIntegrationInstalled = (installations?.length || 0) > 0;
  const isLoaded = !!installations && !isInstallationLoading;

  useEffect(() => { if (isError) handleServerError(error); }, [isError, error]);

  return { isLoaded, isIntegrationInstalled, isLoading: isInstallationLoading };
};

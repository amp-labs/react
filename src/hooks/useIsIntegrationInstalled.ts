import { useEffect } from "react";
import { Config } from "src/services/api";
import { handleServerError } from "src/utils/handleServerError";

import { useListInstallationsQuery } from "./query/useListInstallationsQuery";

interface UseIsIntegrationInstalledResult {
  isLoading: boolean;
  isLoaded: boolean;
  isIntegrationInstalled: boolean | null;
  config?: Config;
}

export const useIsIntegrationInstalled = (
  integration: string,
  groupRef: string,
): UseIsIntegrationInstalledResult => {
  const {
    data: installations,
    isLoading: isInstallationLoading,
    isError,
    error,
  } = useListInstallationsQuery(integration, groupRef);

  const isIntegrationInstalled = (installations?.length || 0) > 0;
  const isLoaded = !!installations && !isInstallationLoading;
  const firstInstallation = installations?.[0];
  const config = firstInstallation?.config;

  useEffect(() => {
    if (isError) handleServerError(error);
  }, [isError, error]);

  return {
    isLoaded,
    isIntegrationInstalled,
    isLoading: isInstallationLoading,
    config,
  };
};

import { useEffect } from "react";
import { Config } from "src/services/api";
import { handleServerError } from "src/utils/handleServerError";

import { useListInstallationsQuery } from "./query/useListInstallationsQuery";

interface UseIsIntegrationInstalledResult {
  isLoading: boolean;
  isLoaded: boolean;
  isIntegrationInstalled: boolean | null;
  config?: Config;
  isError: boolean;
  error: Error | null;
}

/**
 * Hook to check if an integration is installed for a specific group
 *
 * @param integration - Integration name or ID
 * @param groupRef - Group reference.
 * @param consumerRef - Consumer reference. Required for JWT auth if not provided via InstallationProvider.
 *
 * @remarks
 * For JWT authentication, consumerRef and groupRef must be provided either:
 * 1. Via InstallationProvider context, or
 * 2. As parameters to this hook (overrides context values)
 *
 * For API key authentication, consumerRef parameter is not required.
 */
export const useIsIntegrationInstalled = (
  integration: string,
  groupRef: string,
  consumerRef?: string,
): UseIsIntegrationInstalledResult => {
  const {
    data: installations,
    isLoading: isInstallationLoading,
    isError,
    error,
  } = useListInstallationsQuery(integration, groupRef, consumerRef);

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
    isError,
    error,
  };
};

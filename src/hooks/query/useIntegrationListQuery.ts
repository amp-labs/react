import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { ErrorBoundary, useErrorState } from "src/context/ErrorContextProvider";
import { useAPI } from "src/services/api";
import { handleServerError } from "src/utils/handleServerError";

/**
 * Custom hook to fetch integrations using React Query.
 *
 * This hook retrieves integration information based on the `projectIdOrName`
 * provided by the Ampersand context. It uses the `listIntegrations` method
 * from the API service to fetch the data and returns an enhanced query object
 * with additional properties such as `integrations`.
 *
 * @param groupRefOverride - Group reference. Required for JWT auth if not provided via InstallationProvider.
 * @param consumerRefOverride - Consumer reference. Required for JWT auth if not provided via InstallationProvider.
 * @returns {Object} An object containing:
 */
export function useListIntegrationsQuery(
  groupRefOverride?: string,
  consumerRefOverride?: string,
) {
  const getAPI = useAPI(groupRefOverride, consumerRefOverride);
  const { projectIdOrName } = useAmpersandProviderProps();
  const { setError, removeError } = useErrorState();

  const query = useQuery({
    queryKey: ["amp", "integrations", projectIdOrName],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error("Project ID or name is required");
      const api = await getAPI();
      return api.integrationApi.listIntegrations({ projectIdOrName });
    },
    enabled: !!projectIdOrName,
  });

  useEffect(() => {
    if (query.isError) {
      handleServerError(query.error);
      setError(ErrorBoundary.INTEGRATION_LIST, projectIdOrName);
    } else {
      removeError(ErrorBoundary.INTEGRATION_LIST, projectIdOrName);
    }
  }, [query.isError, query.error, projectIdOrName, setError, removeError]);

  return query;
}

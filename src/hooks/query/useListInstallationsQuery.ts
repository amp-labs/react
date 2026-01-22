import { useQuery } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useAPI } from "src/services/api";

import { useListIntegrationsQuery } from "./useIntegrationListQuery";

/**
 * Query hook to list installations for a specific integration and group
 *
 * @param integration - Integration name or ID
 * @param groupRef - Group reference.
 * @param consumerRefOverride - Consumer reference. Required for JWT auth if not provided via InstallationProvider.
 */
export const useListInstallationsQuery = (
  integration?: string,
  groupRef?: string,
  consumerRefOverride?: string,
) => {
  const getAPI = useAPI(groupRef, consumerRefOverride);
  const { projectIdOrName } = useAmpersandProviderProps(); // in AmpersandProvider
  const { data: integrations } = useListIntegrationsQuery(
    groupRef,
    consumerRefOverride,
  );

  const integrationId = integrations?.find(
    (_integration) => _integration.name === integration,
  )?.id;

  return useQuery({
    queryKey: [
      "amp",
      "installations",
      projectIdOrName,
      integrationId,
      groupRef,
    ],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error("Project ID is required");
      if (!integrationId) throw new Error("Integration ID is required");
      if (!groupRef) throw new Error("Group reference is required");

      const api = await getAPI();
      return api.installationApi.listInstallations({
        projectIdOrName,
        integrationId,
        groupRef,
      });
    },
    enabled:
      !!projectIdOrName &&
      !!integrationId &&
      !!groupRef &&
      !!integrations &&
      integrations.length > 0,
  });
};

import { useQuery } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useIntegrationList } from "src/context/IntegrationListContextProvider";
import { useAPI } from "src/services/api";

export const useListInstallationsQuery = (
  integration?: string,
  groupRef?: string,
) => {
  const getAPI = useAPI();
  const { projectIdOrName } = useAmpersandProviderProps(); // in AmpersandProvider
  const { integrations } = useIntegrationList(); // in AmpersandProvider

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

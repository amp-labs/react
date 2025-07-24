import { useQuery } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useAPI } from "src/services/api";

export function useListIntegrationsQuery() {
  const getAPI = useAPI();
  const { projectIdOrName } = useAmpersandProviderProps();

  return useQuery({
    queryKey: ["amp", "integrations", projectIdOrName],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error("Project ID or name is required");
      const api = await getAPI();
      return api.integrationApi.listIntegrations({ projectIdOrName });
    },
    enabled: !!projectIdOrName,
  });
}

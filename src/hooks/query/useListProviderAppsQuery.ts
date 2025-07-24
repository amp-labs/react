import { useQuery } from "@tanstack/react-query";
import { useAPI } from "services/api";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";

export const useListProviderAppsQuery = () => {
  const getAPI = useAPI();
  const { projectIdOrName } = useAmpersandProviderProps();

  return useQuery({
    queryKey: ["amp", "providerApps", projectIdOrName],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error("Project ID is required");
      const api = await getAPI();
      return api.providerAppApi.listProviderApps({ projectIdOrName });
    },
    enabled: !!projectIdOrName,
  });
};

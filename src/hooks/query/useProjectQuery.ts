import { useQuery } from "@tanstack/react-query";
import { useAPI } from "services/api";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider/AmpersandContextProvider";

// use react query hook
const useProjectQuery = () => {
  const getAPI = useAPI();
  const { projectIdOrName } = useAmpersandProviderProps();

  const query = useQuery({
    queryKey: ["project", projectIdOrName],
    queryFn: async () => {
      const api = await getAPI();
      return api.projectApi.getProject({ projectIdOrName });
    },
  });

  return {
    ...query,
    projectIdOrName,
    appName: query.data?.name,
    projectId: query.data?.id,
  };
};

export { useProjectQuery };

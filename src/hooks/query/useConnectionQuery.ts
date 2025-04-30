import { useQuery } from "@tanstack/react-query";
import { useProject } from "src/context/ProjectContextProvider";
import { useAPI } from "src/services/api";

type ConnectionQueryProps = {
  connectionId: string;
};

export const useConnectionQuery = ({ connectionId }: ConnectionQueryProps) => {
  const getAPI = useAPI();
  const { projectIdOrName } = useProject();

  return useQuery({
    queryKey: ["connection", connectionId, projectIdOrName],
    queryFn: async () => {
      if (!projectIdOrName) {
        throw new Error(
          "Project ID or name not found. Please wrap this component inside of AmpersandProvider",
        );
      }
      if (!connectionId) throw new Error("Connection ID not found.");

      const api = await getAPI();
      return api.connectionApi.getConnection({ projectIdOrName, connectionId });
    },
    enabled: !!projectIdOrName && !!connectionId,
  });
};

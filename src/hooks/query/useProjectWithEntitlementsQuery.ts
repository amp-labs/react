import { useQuery } from "@tanstack/react-query";
import { useAPI } from "services/api";
import { useProject } from "src/context/ProjectContextProvider";

/**
 * Query to get the project with entitlements
 * entitlements is separate call additional call, a separate query is used to avoid
 * unnecessary latency
 * @returns
 */
export const useProjectWithEntitlementsQuery = () => {
  const { project } = useProject();
  const projectIdOrName = project?.id;
  const getAPI = useAPI();

  return useQuery({
    queryKey: ["project", projectIdOrName, "entitlements"],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error("Project ID is required");
      const api = await getAPI();
      return api.projectApi.getProject({
        projectIdOrName,
        includeEntitlements: true,
      });
    },
    enabled: !!projectIdOrName,
  });
};

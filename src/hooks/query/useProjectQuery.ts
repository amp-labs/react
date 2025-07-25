import { useQuery } from "@tanstack/react-query";
import { useAPI } from "services/api";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider/AmpersandContextProvider";

/**
 * Custom hook to fetch project data using React Query.
 * 
 * This hook retrieves project information based on the `projectIdOrName` provided
 * by the Ampersand context. It uses the `getProject` method from the API service
 * to fetch the data and returns an enhanced query object with additional properties
 * such as `appName` and `projectId`.
 * 
 * @returns {Object} An object containing:
 *   - All properties from the React Query result (`data`, `error`, `isLoading`, etc.).
 *   - `projectIdOrName`: The identifier for the project.
 *   - `appName`: The name of the project (if available).
 *   - `projectId`: The ID of the project (if available).
 */
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

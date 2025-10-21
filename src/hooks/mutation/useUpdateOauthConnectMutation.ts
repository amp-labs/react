import { OauthUpdateRequest } from "@generated/api/src";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAPI } from "services/api";

export const useUpdateOauthConnectMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateOauthConnection"],
    mutationFn: async (request: OauthUpdateRequest) => {
      // Validate required fields before making API call
      if (!request.projectIdOrName || !request.connectionId) {
        // Return rejected promise instead of throw to be more explicit
        return Promise.reject(
          new Error("Project ID and connection ID are required"),
        );
      }
      const api = await getAPI();
      return api.oAuthApi.oauthUpdate(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
};

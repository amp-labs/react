import { OauthConnectOperationRequest } from "@generated/api/src";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAPI } from "services/api";

export const useCreateOauthConnectionMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createOauthConnection"],
    mutationFn: async (request: OauthConnectOperationRequest) => {
      const api = await getAPI();
      return api.oAuthApi.oauthConnect(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
};

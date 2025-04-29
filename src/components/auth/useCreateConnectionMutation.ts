import { GenerateConnectionOperationRequest } from "@generated/api/src";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAPI } from "services/api";
import { handleServerError } from "src/utils/handleServerError";

export function useCreateConnectionMutation() {
  const getAPI = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createConnection"],
    mutationFn: async (params: GenerateConnectionOperationRequest) => {
      const api = await getAPI();
      return api.connectionApi.generateConnection(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
    },
    onError: (error) => {
      console.error("Error creating connection and loading provider info");
      handleServerError(error);
    },
  });
}

import { useState } from "react";
import { DeleteConnectionRequest } from "@generated/api/src";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAPI } from "services/api";
import { handleServerError } from "src/utils/handleServerError";

export const useDeleteConnectionMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationKey: ["deleteConnection"],
    mutationFn: async (request: DeleteConnectionRequest) => {
      const api = await getAPI();
      return api.connectionApi.deleteConnection(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
      setErrorMsg(null);
    },
    onError: (error) => {
      console.error("Error deleting connection");
      handleServerError(error, setErrorMsg);
    },
  });

  return {
    ...mutation,
    errorMsg,
  };
};

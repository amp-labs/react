import { CustomAuthConnectOperationRequest } from "@generated/api/src";
import { useMutation } from "@tanstack/react-query";
import { useAPI } from "services/api";

export const useCustomAuthConnectMutation = () => {
  const getAPI = useAPI();
  return useMutation({
    mutationKey: ["customAuthConnect"],
    mutationFn: async (request: CustomAuthConnectOperationRequest) => {
      const api = await getAPI();
      return api.connectionApi.customAuthConnect(request);
    },
  });
};

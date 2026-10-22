import { useMutation } from "@tanstack/react-query";
import { useAPI } from "services/api";

export interface ResubscribeInstallationRequest {
  projectIdOrName: string;
  integrationId: string;
  installationId: string;
}

/**
 * Asks the server to restart subscribe setup for an installation.
 *
 * The server decides whether anything needs doing and returns 200 either way, so this is safe to
 * call without inspecting subscription state first. The work runs asynchronously; there is nothing
 * to await beyond the request being accepted.
 */
export const useResubscribeInstallationMutation = () => {
  const getAPI = useAPI();

  return useMutation({
    mutationKey: ["resubscribeInstallation"],
    mutationFn: async (request: ResubscribeInstallationRequest) => {
      const api = await getAPI();

      return api.installationApi.resubscribeInstallation(request);
    },
  });
};

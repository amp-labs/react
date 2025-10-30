import { useQuery } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";
import { useAPI } from "src/services/api";

// headless hooks
import { useInstallationProps } from "../InstallationProvider";
import { useConnection } from "../useConnection";

/**
 * gets hydrated revision using headless hooks to fill in details
 * @returns
 */
export const useHydratedRevisionQuery = () => {
  const getAPI = useAPI();
  const {
    connection,
    isPending: isConnectionsPending,
    isFetching: isConnectionsFetching,
  } = useConnection();
  const { projectIdOrName } = useAmpersandProviderProps();
  const { integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);

  const connectionId = connection?.id;
  const integrationId = integrationObj?.id;
  const revisionId = integrationObj?.latestRevision?.id;
  const isConnectionsLoading = isConnectionsPending || isConnectionsFetching;

  return useQuery({
    queryKey: [
      "amp",
      "hydratedRevision",
      projectIdOrName,
      integrationId,
      revisionId,
      connectionId,
    ],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error("projectIdOrName is required");
      if (!integrationId) throw new Error("integrationId is required");
      if (!revisionId) throw new Error("revisionId is required");
      if (!connectionId) throw new Error("connectionId is required");

      const api = await getAPI();
      return api.revisionApi.getHydratedRevision({
        projectIdOrName,
        integrationId,
        revisionId,
        connectionId,
      });
    },
    enabled:
      !!projectIdOrName &&
      !!integrationId &&
      !!revisionId &&
      !!connectionId &&
      !isConnectionsLoading,
  });
};

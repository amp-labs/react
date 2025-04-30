import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProject } from "src/context/ProjectContextProvider";
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
  const queryClient = useQueryClient();
  const getAPI = useAPI();
  const {
    connection,
    isPending: isConnectionsPending,
    isFetching: isConnectionsFetching,
  } = useConnection();
  const { projectIdOrName } = useProject();
  const { integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);

  const connectionId = connection?.id;
  const integrationId = integrationObj?.id;
  const revisionId = integrationObj?.latestRevision?.id;
  const isConnectionsLoading = isConnectionsPending || isConnectionsFetching;

  useEffect(() => {
    if (!connectionId) {
      // clear the query cache if connectionId is not set (includes resetting cached errors)
      queryClient.invalidateQueries({ queryKey: ["amp", "hydratedRevision"] });
    }
  }, [connectionId, queryClient]);

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
    retry: 3, // retry 3 times before showing error
    enabled:
      !!projectIdOrName &&
      !!integrationId &&
      !!revisionId &&
      !!connectionId &&
      !isConnectionsLoading,
  });
};

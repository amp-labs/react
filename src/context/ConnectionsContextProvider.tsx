import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnectionsListQuery } from "hooks/query/useConnectionsListQuery";
import { useIntegrationQuery } from "hooks/query/useIntegrationQuery";
import { Connection } from "services/api";
import {
  ComponentContainerError,
  ComponentContainerLoading,
} from "src/components/Configure/ComponentContainer";
import { handleServerError } from "src/utils/handleServerError";

import { useProjectQuery } from "../hooks/query";

import { ErrorBoundary, useErrorState } from "./ErrorContextProvider";
import { useInstallIntegrationProps } from "./InstallIIntegrationContextProvider/InstallIntegrationContextProvider";

interface ConnectionsContextValue {
  connections: Connection[] | null;
  isConnectionsLoading: boolean;
  selectedConnection: Connection | null;
  setConnections: (connections: Connection[]) => void;
  setSelectedConnection: React.Dispatch<
    React.SetStateAction<Connection | null>
  >;
}

export const ConnectionsContext = createContext<ConnectionsContextValue>({
  connections: null,
  isConnectionsLoading: true,
  selectedConnection: null,
  setConnections: () => {},
  setSelectedConnection: () => {},
});

export const useConnections = (): ConnectionsContextValue => {
  const context = useContext(ConnectionsContext);

  if (!context) {
    throw new Error("useConnections must be used within a ConnectionsProvider");
  }

  return context;
};

type ConnectionsProviderProps = {
  groupRef?: string; // must pass in if not in Install Integration
  provider?: string; // must pass in if not in Install Integration
  children?: React.ReactNode;
};

export function ConnectionsProvider({
  groupRef,
  provider,
  children,
}: ConnectionsProviderProps) {
  const queryClient = useQueryClient();
  const { setError, isError } = useErrorState();
  const { projectIdOrName, isLoading: isProjectLoading } = useProjectQuery();
  const { integrationId, groupRef: groupRefProp } =
    useInstallIntegrationProps();
  const { provider: integrationProvider } = useIntegrationQuery(integrationId);

  const {
    data: connections,
    isLoading: isConnectionsLoading,
    isError: isConnectionsError,
    error: connectionError,
  } = useConnectionsListQuery({
    groupRef: groupRef || groupRefProp,
    provider: integrationProvider || provider,
  });

  // simplify connections logic to be derived from the first connection
  const selectedConnection = connections?.[0];

  // legacy setConnections function placeholder
  // set connections in cache and invalidate queries
  const setConnections = useCallback(
    (_connections: Connection[]) => {
      queryClient.setQueryData(["amp", "connections"], () => _connections);
      queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
    },
    [queryClient],
  );

  // legacy setSelectedConnection function
  // invalidate connection query to refetch
  const setSelectedConnection = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
  }, [queryClient]);

  // legacy set global error state for connections
  useEffect(() => {
    if (isConnectionsError) {
      setError(ErrorBoundary.CONNECTION_LIST, projectIdOrName, true);
      handleServerError(connectionError);
    } else {
      setError(ErrorBoundary.CONNECTION_LIST, projectIdOrName, false);
    }
  }, [isConnectionsError, setError, projectIdOrName, connectionError]);

  const contextValue = useMemo(
    () => ({
      connections: connections || null,
      isConnectionsLoading,
      selectedConnection: selectedConnection || null,
      setConnections,
      setSelectedConnection,
    }),
    [
      connections,
      isConnectionsLoading,
      selectedConnection,
      setConnections,
      setSelectedConnection,
    ],
  );

  if (isConnectionsLoading || isProjectLoading) {
    return <ComponentContainerLoading />;
  }

  if (projectIdOrName && isError(ErrorBoundary.PROJECT, projectIdOrName)) {
    return (
      <ComponentContainerError
        message={`Error loading project ${projectIdOrName}`}
      />
    );
  }

  if (
    projectIdOrName &&
    isError(ErrorBoundary.CONNECTION_LIST, projectIdOrName)
  ) {
    return (
      <ComponentContainerError message="Error retrieving existing connections" />
    );
  }

  if (!projectIdOrName) {
    throw new Error(
      "Project ID or Project Name not found. ConnectionsProvider must be used within AmpersandProvider",
    );
  }

  return (
    <ConnectionsContext.Provider value={contextValue}>
      {children}
    </ConnectionsContext.Provider>
  );
}

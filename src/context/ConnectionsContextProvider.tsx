import {
  createContext, useCallback, useContext, useEffect, useMemo,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Connection, useAPI } from 'services/api';
import { ComponentContainerError, ComponentContainerLoading } from 'src/components/Configure/ComponentContainer';
import { handleServerError } from 'src/utils/handleServerError';

import { ErrorBoundary, useErrorState } from './ErrorContextProvider';
import { useInstallIntegrationProps } from './InstallIntegrationContextProvider';
import { useProject } from './ProjectContextProvider';

interface ConnectionsContextValue {
  connections: Connection[] | null;
  isConnectionsLoading: boolean;
  selectedConnection: Connection | null;
  setConnections: (connections: Connection[]) => void;
  setSelectedConnection: React.Dispatch<React.SetStateAction<Connection | null>>;
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
    throw new Error('useConnections must be used within a ConnectionsProvider');
  }

  return context;
};

const useConnectionsListQuery = () => {
  const { projectIdOrName } = useProject();
  const { groupRef, provider } = useInstallIntegrationProps();
  const getAPI = useAPI();
  return useQuery({
    queryKey: ['amp', 'connections', projectIdOrName, groupRef, provider],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error('Project ID not found.');
      if (!groupRef) throw new Error('Group reference not found.');
      if (!provider) throw new Error('Provider not found.');

      const api = await getAPI();
      return api.connectionApi.listConnections({ projectIdOrName, groupRef, provider });
    },
    enabled: !!projectIdOrName && !!groupRef && !!provider,
  });
};

type ConnectionsProviderProps = {

  children?: React.ReactNode;
};

export function ConnectionsProvider({ children }: ConnectionsProviderProps) {
  const queryClient = useQueryClient();
  const { setError, isError } = useErrorState();
  const { projectId, isLoading: isProjectLoading } = useProject();

  const {
    data: connections, isLoading: isConnectionsLoading, isError: isConnectionsError, error: connectionError,
  } = useConnectionsListQuery();

  // simplify connections logic to be derived from the first connection
  const selectedConnection = connections?.[0];

  // legacy setConnections function placeholder
  // set connections in cache and invalidate queries
  const setConnections = useCallback((_connections:Connection[]) => {
    queryClient.setQueryData(['amp', 'connections'], () => _connections);
    queryClient.invalidateQueries({ queryKey: ['amp', 'connections'] });
  }, [queryClient]);

  // legacy setSelectedConnection function
  // invalidate connection query to refetch
  const setSelectedConnection = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['amp', 'connections'] });
  }, [queryClient]);

  // legacy set global error state for connections
  useEffect(
    () => {
      if (isConnectionsError) {
        setError(ErrorBoundary.CONNECTION_LIST, projectId, true);
        handleServerError(connectionError);
      } else {
        setError(ErrorBoundary.CONNECTION_LIST, projectId, false);
      }
    },
    [isConnectionsError, setError, projectId, connectionError],
  );

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

  if (isError(ErrorBoundary.PROJECT, projectId)) {
    return <ComponentContainerError message={`Error loading project ${projectId}`} />;
  }

  if (isError(ErrorBoundary.CONNECTION_LIST, projectId)) {
    return <ComponentContainerError message="Error retrieving existing connections" />;
  }

  if (!projectId) {
    throw new Error(
      'Project ID not found. ConnectionsProvider must be used within AmpersandProvider',
    );
  }

  return (
    <ConnectionsContext.Provider value={contextValue}>
      { children }
    </ConnectionsContext.Provider>
  );
}

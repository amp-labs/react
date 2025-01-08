import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { Connection, useAPI } from 'services/api';
import { ComponentContainerError, ComponentContainerLoading } from 'src/components/Configure/ComponentContainer';
import { useIsInstallationDeleted } from 'src/hooks/useIsInstallationDeleted';
import { handleServerError } from 'src/utils/handleServerError';

import { ErrorBoundary, useErrorState } from './ErrorContextProvider';
import { useInstallIntegrationProps } from './InstallIntegrationContextProvider';
import { useProject } from './ProjectContextProvider';

interface ConnectionsContextValue {
  connections: Connection[] | null;
  selectedConnection: Connection | null;
  setConnections: React.Dispatch<React.SetStateAction<Connection[] | null>>;
  setSelectedConnection: React.Dispatch<
  React.SetStateAction<Connection | null>
  >;
  isIntegrationDeleted: boolean;
  setIntegrationDeleted: () => void;
}

export const ConnectionsContext = createContext<ConnectionsContextValue>({
  connections: null,
  selectedConnection: null,
  setConnections: () => {},
  setSelectedConnection: () => {},
  isIntegrationDeleted: false,
  setIntegrationDeleted: () => {},
});

export const useConnections = (): ConnectionsContextValue => {
  const context = useContext(ConnectionsContext);

  if (!context) {
    throw new Error('useConnections must be used within a ConnectionsProvider');
  }

  return context;
};

type ConnectionsProviderProps = {
  provider?: string;
  groupRef: string;
  children?: React.ReactNode;
};

export function ConnectionsProvider({
  provider,
  groupRef,
  children,
}: ConnectionsProviderProps) {
  const getAPI = useAPI();
  const { projectId, isLoading: isProjectLoading } = useProject();

  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isLoading, setLoadingState] = useState<boolean>(true);
  const { setError, isError } = useErrorState();
  const { provider: providerFromProps } = useInstallIntegrationProps();
  const { isIntegrationDeleted, setIntegrationDeleted } = useIsInstallationDeleted();

  const selectedProvider = provider || providerFromProps;
  if (!selectedProvider) {
    throw new Error(
      'ConnectionsProvider must be given a provider prop or be used within InstallIntegrationProvider',
    );
  }

  useEffect(() => {
    async function fetchConnections() {
      const api = await getAPI();
      if (!projectId) {
        throw new Error('Project ID not found. ConnectionsProvider must be used within AmpersandProvider');
      }
      api.connectionApi.listConnections(
        { projectIdOrName: projectId, groupRef, provider: selectedProvider },
      )
        .then((_connections) => {
          setLoadingState(false);
          setConnections(_connections);
          // If the provider has changed, reset the selected connection if it does
          // not match the new provider
          if (selectedConnection && selectedConnection.provider !== selectedProvider) {
            setSelectedConnection(null);
          }
        })
        .catch((err) => {
          console.error(
            `Error retrieving existing connections for group ID ${groupRef}.`,
          );
          handleServerError(err);
          setLoadingState(false);
          setError(ErrorBoundary.CONNECTION_LIST, projectId);
        });
    }

    if (projectId) {
      fetchConnections();
    }
  }, [projectId, groupRef, selectedProvider, setError, getAPI, selectedConnection]);

  const contextValue = useMemo(
    () => ({
      connections,
      selectedConnection,
      setConnections,
      setSelectedConnection,
      isIntegrationDeleted,
      setIntegrationDeleted,
    }),
    [
      connections,
      selectedConnection,
      setConnections,
      setSelectedConnection,
      isIntegrationDeleted,
      setIntegrationDeleted,
    ],
  );

  if (isLoading || isProjectLoading) {
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

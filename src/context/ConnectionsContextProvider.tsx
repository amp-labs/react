import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { api, Connection } from 'services/api';
import { ComponentContainerError, ComponentContainerLoading } from 'src/components/Configure/ComponentContainer';
import { useIsInstallationDeleted } from 'src/hooks/useIsInstallationDeleted';
import { handleServerError } from 'src/utils/handleServerError';

import { useApiKey } from './ApiKeyContextProvider';
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
  const apiKey = useApiKey();
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
    if (projectId && apiKey) {
      api()
        .connectionApi.listConnections(
          { projectIdOrName: projectId, groupRef, provider: selectedProvider },
          {
            headers: {
              'X-Api-Key': apiKey ?? '',
            },
          },
        )
        .then((_connections) => {
          setLoadingState(false);
          setConnections(_connections);
        })
        .catch((err) => {
          console.error(
            `Error retrieving existing OAuth connections for group ID ${groupRef}.`,
          );
          handleServerError(err);
          setLoadingState(false);
          setError(ErrorBoundary.CONNECTION_LIST, projectId);
        });
    }
  }, [projectId, apiKey, groupRef, selectedProvider, setError]);

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

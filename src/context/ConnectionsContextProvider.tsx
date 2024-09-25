import {
  createContext,
  useContext, useEffect, useMemo, useState,
} from 'react';

import { ErrorTextBox } from 'components/ErrorTextBox/ErrorTextBox';
import { api, Connection } from 'services/api';
import { LoadingCentered } from 'src/components/Loading';
import { handleServerError } from 'src/utils/handleServerError';

import { useApiKey } from './ApiKeyContextProvider';
import {
  ErrorBoundary, useErrorState,
} from './ErrorContextProvider';
import { useInstallIntegrationProps } from './InstallIntegrationContextProvider';
import { useProject } from './ProjectContextProvider';

interface ConnectionsContextValue {
  connections: Connection[] | null;
  selectedConnection: Connection | null;
  setConnections: React.Dispatch<React.SetStateAction<Connection[] | null>>;
  setSelectedConnection: React.Dispatch<React.SetStateAction<Connection | null>>;
}

export const ConnectionsContext = createContext<ConnectionsContextValue>({
  connections: null,
  selectedConnection: null,
  setConnections: () => { },
  setSelectedConnection: () => { },
});

export const useConnections = (): ConnectionsContextValue => {
  const context = useContext(ConnectionsContext);

  if (!context) {
    throw new Error('useConnections must be used within a ConnectionsProvider');
  }

  return context;
};

type ConnectionsProviderProps = {
  provider?: string,
  groupRef: string,
  children?: React.ReactNode;
};

export function ConnectionsProvider({
  provider, groupRef, children,
}: ConnectionsProviderProps) {
  const apiKey = useApiKey();
  const { projectId } = useProject();

  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isLoading, setLoadingState] = useState<boolean>(true);
  const { setError, isError } = useErrorState();
  const { provider: providerFromProps } = useInstallIntegrationProps();

  if (!projectId) {
    throw new Error('ConnectionsProvider must be used within AmpersandProvider');
  }

  const selectedProvider = provider || providerFromProps;

  if (!selectedProvider) {
    throw new Error('ConnectionsProvider must be given a provider prop or be used within InstallIntegrationProvider');
  }

  useEffect(() => {
    api().connectionApi.listConnections({ projectIdOrName: projectId, groupRef, provider: selectedProvider }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_connections) => {
      setLoadingState(false);
      setConnections(_connections);
    }).catch((err) => {
      console.error(`Error retrieving existing OAuth connections for group ID ${groupRef}.`);
      handleServerError(err);
      setLoadingState(false);
      setError(ErrorBoundary.CONNECTION_LIST, projectId);
    });
  }, [projectId, apiKey, groupRef, selectedProvider, setError]);

  const contextValue = useMemo(() => ({
    connections,
    selectedConnection,
    setConnections,
    setSelectedConnection,
  }), [connections, selectedConnection, setConnections, setSelectedConnection]);

  return (
    isError(ErrorBoundary.CONNECTION_LIST, projectId)
      ? <ErrorTextBox message="Error retrieving existing connections" />
      : (
        <ConnectionsContext.Provider value={contextValue}>
          {isLoading ? <LoadingCentered /> : children}
        </ConnectionsContext.Provider>
      )
  );
}

import {
  createContext,
  useContext, useEffect, useMemo, useState,
} from 'react';

import { LoadingIcon } from '../assets/LoadingIcon';
import { ErrorTextBox } from '../components/Configure/ErrorTextBox';
import { api, Connection } from '../services/api';

import { useApiKey } from './ApiKeyProvider';
import {
  ErrorBoundary, useErrorState,
} from './ErrorContextProvider';
import { useInstallIntegrationProps } from './InstallIntegrationContext';
import { useProject } from './ProjectContext';

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

  if (!provider && !providerFromProps) {
    throw new Error('ConnectionsProvider must be given a provider prop or be used within InstallIntegrationProvider');
  }

  useEffect(() => {
    api().connectionApi.listConnections({ projectId, groupRef, provider }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_connections) => {
      setLoadingState(false);
      setConnections(_connections);
    }).catch((err) => {
      setLoadingState(false);
      setError(ErrorBoundary.CONNECTION_LIST, projectId);
      console.error(`Error retrieving existing OAuth connections for group ID ${groupRef}:`, err);
    });
  }, [projectId, apiKey, groupRef, provider, setError]);

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
          {isLoading ? <LoadingIcon /> : children}
        </ConnectionsContext.Provider>
      )
  );
}

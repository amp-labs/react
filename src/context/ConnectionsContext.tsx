import React, {
  createContext, useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';

import { LoadingIcon } from '../assets/LoadingIcon';
import { ErrorTextBox } from '../components/Configure/ErrorTextBox';
import { api, Connection } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';
import {
  ErrorBoundary, isError, setError, useErrorState,
} from './ErrorContextProvider';
import { useInstallIntegrationProps } from './InstallIntegrationContext';

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
    throw new Error('useConnections must be used within a ConnectionsListProvider');
  }

  return context;
};

type ConnectionsProviderProps = {
  projectId: string;
  children?: React.ReactNode;
};

export function ConnectionsProvider({
  projectId,
  children,
}: ConnectionsProviderProps) {
  const { groupRef, provider } = useInstallIntegrationProps();
  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const apiKey = useContext(ApiKeyContext);
  const [isLoading, setLoadingState] = useState<boolean>(true);
  const { errorState, setErrorState } = useErrorState();

  useEffect(() => {
    api().listConnections({ projectId, groupRef, provider }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_connections) => {
      setLoadingState(false);
      setConnections(_connections);
    }).catch((err) => {
      setLoadingState(false);
      setError(ErrorBoundary.CONNECTION_LIST, projectId, setErrorState);
      console.error('ERROR: ', err);
    });
  }, [projectId, apiKey, groupRef, provider]);

  const contextValue = useMemo(() => ({
    connections,
    selectedConnection,
    setConnections,
    setSelectedConnection,
  }), [connections, selectedConnection, setConnections, setSelectedConnection]);

  return (
    isError(ErrorBoundary.CONNECTION_LIST, projectId, errorState)
      ? <ErrorTextBox message={`Error retrieving connection information for project '${projectId}'`} />
      : (
        <ConnectionsContext.Provider value={contextValue}>
          {isLoading ? <LoadingIcon /> : children}
        </ConnectionsContext.Provider>
      )

  );
}

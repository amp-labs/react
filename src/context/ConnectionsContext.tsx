import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { api, Connection } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';

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
  setSelectedConnection: () => {},
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
  groupRef: string;
  provider?: string;
  children?: React.ReactNode;
};

export function ConnectionsProvider({
  projectId,
  groupRef,
  provider,
  children,
}: ConnectionsProviderProps) {
  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const apiKey = useContext(ApiKeyContext);

  useEffect(() => {
    api.listConnections({ projectId, groupRef, provider }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_connections) => {
      console.log('CONNECTIONS: ', _connections);
      setConnections(_connections);
    }).catch((err) => {
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
    <ConnectionsContext.Provider value={contextValue}>
      {children}
    </ConnectionsContext.Provider>
  );
}

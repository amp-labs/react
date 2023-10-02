/**
 * Currently not being used; but will possibly use when multiple connections are supported
 */
import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { api, Connection } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';

interface ConnectionsListContextValue {
  connections: Connection[] | null;
}

export const ConnectionsListContext = createContext<ConnectionsListContextValue>({
  connections: null,
});

export const useConnectionsList = (): ConnectionsListContextValue => {
  const context = useContext(ConnectionsListContext);

  if (!context) {
    throw new Error('useConnectionsList must be used within a ConnectionsListProvider');
  }

  return context;
};

type ConnectionsListProviderProps = {
  projectId: string;
  groupRef: string;
  provider?: string;
  children?: React.ReactNode;
};

export function ConnectionsListProvider({
  projectId,
  groupRef,
  provider,
  children,
}: ConnectionsListProviderProps) {
  const [connections, setConnections] = useState<Connection[] | null>(null);
  const apiKey = useContext(ApiKeyContext);

  useEffect(() => {
    if (groupRef) {
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
    }
  }, [projectId, apiKey, groupRef]);

  const contextValue = useMemo(() => ({
    connections,
  }), [connections]);

  return (
    <ConnectionsListContext.Provider value={contextValue}>
      {children}
    </ConnectionsListContext.Provider>
  );
}

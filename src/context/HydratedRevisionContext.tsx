import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { api, HydratedRevision } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';
import { useConnections } from './ConnectionsContext';
import { useInstallIntegrationProps } from './InstallIntegrationContext';

interface HydratedRevisionContextValue {
  hydratedRevision: HydratedRevision | null;
  loading: boolean;
  error: string | null;
}

export const HydratedRevisionContext = createContext<HydratedRevisionContextValue>({
  hydratedRevision: null,
  loading: false,
  error: null,
});

export const useHydratedRevision = () => {
  const context = useContext(HydratedRevisionContext);

  if (!context) {
    throw new Error('useHydratedRevision must be used within a HydratedRevisionProvider');
  }

  return context;
};

type HydratedRevisionProviderProps = {
  projectId?: string | null;
  children?: React.ReactNode;
};

export function HydratedRevisionProvider({
  projectId,
  children,
} : HydratedRevisionProviderProps) {
  const { integrationId, integrationObj } = useInstallIntegrationProps();
  const [hydratedRevision, setHydratedRevision] = useState<HydratedRevision | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiKey = useContext(ApiKeyContext);
  const { selectedConnection } = useConnections();
  const connectionId = selectedConnection?.id;
  const revisionId = integrationObj?.latestRevision?.id;

  useEffect(() => {
    // Fetch the hydrated revision data using your API call
    if (projectId && integrationId && revisionId && connectionId) {
      api().getHydratedRevision({
        projectId,
        integrationId,
        revisionId,
        connectionId,
      }, {
        headers: {
          'X-Api-Key': apiKey ?? '',
        },
      })
        .then((data) => {
          setHydratedRevision(data);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          setHydratedRevision(null);
          setLoading(false);
          setError(err.message || 'An error occurred while fetching data');
        });
    }
  }, [projectId, integrationId, revisionId, connectionId, apiKey]);

  const contextValue = useMemo(() => ({
    hydratedRevision,
    loading,
    error,
  }), [hydratedRevision, loading, error]);

  return (
    <HydratedRevisionContext.Provider value={contextValue}>
      {children}
    </HydratedRevisionContext.Provider>
  );
}

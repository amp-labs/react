import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { api, HydratedRevision } from '../services/api';

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
  integrationId?: string | null;
  revisionId?: string | null;
  connectionId?: string | null;
  children?: React.ReactNode;
};

export function HydratedRevisionProvider({
  projectId,
  integrationId,
  revisionId,
  connectionId,
  children,
} : HydratedRevisionProviderProps) {
  const [hydratedRevision, setHydratedRevision] = useState<HydratedRevision | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the hydrated revision data using your API call
    if (projectId && integrationId && revisionId && connectionId) {
      api.getHydratedRevision({
        projectId,
        integrationId,
        revisionId,
        connectionId,
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
  }, [projectId, integrationId, revisionId, connectionId]);

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
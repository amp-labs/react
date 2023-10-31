import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { ErrorTextBox } from '../components/Configure/ErrorTextBox';
import { api, HydratedRevision } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';
import { useConnections } from './ConnectionsContext';
import {
  ErrorBoundary, isError, removeError, setError, useErrorState,
} from './ErrorContextProvider';
import { useInstallIntegrationProps } from './InstallIntegrationContext';
import { useIntegrationList } from './IntegrationListContext';

interface HydratedRevisionContextValue {
  hydratedRevision: HydratedRevision | null;
  loading: boolean;
}

export const HydratedRevisionContext = createContext<HydratedRevisionContextValue>({
  hydratedRevision: null,
  loading: false,
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
}: HydratedRevisionProviderProps) {
  const { integrationId, integrationObj } = useInstallIntegrationProps();
  const { integrations } = useIntegrationList();
  const [hydratedRevision, setHydratedRevision] = useState<HydratedRevision | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { errorState, setErrorState } = useErrorState();
  const apiKey = useContext(ApiKeyContext);
  const { selectedConnection } = useConnections();
  const connectionId = selectedConnection?.id;
  const revisionId = integrationObj?.latestRevision?.id;

  useEffect(() => {
    // Fetch the hydrated revision data using your API call
    if (projectId && integrationId && revisionId && connectionId && apiKey) {
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
          if (isError(ErrorBoundary.HYDRATED_REVISION, integrationId, errorState)) {
            removeError(ErrorBoundary.HYDRATED_REVISION, integrationId, setErrorState);
          }
        })
        .catch((err) => {
          console.error('ERROR: ', err);
          setLoading(false);
          setError(ErrorBoundary.HYDRATED_REVISION, integrationId, setErrorState);
        });
    }
  }, [projectId, integrationId, revisionId, connectionId, apiKey, integrations]);

  const contextValue = useMemo(() => ({
    hydratedRevision,
    loading,
  }), [hydratedRevision, loading]);

  return (
    <HydratedRevisionContext.Provider value={contextValue}>
      {isError(ErrorBoundary.HYDRATED_REVISION, integrationId, errorState) ? <ErrorTextBox message={`Error retrieving integration details for '${integrationObj?.name || integrationId}'`} /> : children}
    </HydratedRevisionContext.Provider>
  );
}

import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { ErrorTextBox } from '../components/Configure/ErrorTextBox';
import { api, HydratedRevision } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';
import { useConnections } from './ConnectionsContext';
import {
  ErrorBoundary, useErrorState,
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
  const { isError, removeError, setError } = useErrorState();
  const apiKey = useContext(ApiKeyContext);
  const { selectedConnection } = useConnections();
  const connectionId = selectedConnection?.id;
  const revisionId = integrationObj?.latestRevision?.id;
  const errorIntegrationIdentifier = integrationObj?.name || integrationId;

  useEffect(() => {
    // Fetch the hydrated revision data using your API call
    if (
      projectId
      && integrationId
      && revisionId
      && connectionId
      && apiKey
      && !isError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier)
    ) {
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
          if (isError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier)) {
            removeError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
          }
        })
        .catch((err) => {
          console.error(`Error loading integration ${errorIntegrationIdentifier}`, err)
          setLoading(false);
          setError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
        });
    }
  }, [
    projectId,
    integrationId,
    revisionId,
    connectionId,
    apiKey,
    integrations,
    isError,
    removeError,
    setError,
    errorIntegrationIdentifier]);

  const contextValue = useMemo(() => ({
    hydratedRevision,
    loading,
  }), [hydratedRevision, loading]);

  return (
    <HydratedRevisionContext.Provider value={contextValue}>
      {isError(ErrorBoundary.HYDRATED_REVISION, integrationId) ? <ErrorTextBox message={`Error retrieving integration details for '${integrationObj?.name || integrationId}'`} /> : children}
    </HydratedRevisionContext.Provider>
  );
}

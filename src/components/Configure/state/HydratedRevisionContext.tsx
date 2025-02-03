import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useConnections } from 'context/ConnectionsContextProvider';
import {
  ErrorBoundary, useErrorState,
} from 'context/ErrorContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import {
  api, HydratedIntegrationRead, HydratedIntegrationWriteObject, HydratedRevision,
} from 'services/api';
import { ComponentContainerError, ComponentContainerLoading } from 'src/components/Configure/ComponentContainer';
import { handleServerError } from 'src/utils/handleServerError';

interface HydratedRevisionContextValue {
  hydratedRevision: HydratedRevision | null;
  loading: boolean;
  readAction?: HydratedIntegrationRead;
  writeObjects: HydratedIntegrationWriteObject[];
}

export const HydratedRevisionContext = createContext<HydratedRevisionContextValue>({
  hydratedRevision: null,
  loading: false,
  readAction: undefined,
  writeObjects: [],
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
  const { selectedConnection } = useConnections();
  const { integrationId, integrationObj } = useInstallIntegrationProps();

  const [hydratedRevision, setHydratedRevision] = useState<HydratedRevision | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isError, removeError, setError } = useErrorState();
  const apiKey = useApiKey();

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
    ) {
      setLoading(true);
      api().revisionApi.getHydratedRevision({
        projectIdOrName: projectId,
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
          removeError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
        })
        .catch((err) => {
          console.error(`Error loading integration ${errorIntegrationIdentifier}.`);
          handleServerError(err);
          setError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [
    projectId,
    integrationId,
    revisionId,
    connectionId,
    apiKey,
    removeError,
    setError,
    errorIntegrationIdentifier]);

  const contextValue = useMemo(() => ({
    hydratedRevision,
    loading,
    readAction: hydratedRevision?.content?.read,
    writeObjects: hydratedRevision?.content?.write?.objects || [],
  }), [hydratedRevision, loading]);

  if (loading) {
    return <ComponentContainerLoading />;
  }

  if (isError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier)) {
    const intNameOrId = integrationObj?.name || integrationId || 'unknown integration';
    const errorMsg = `Error retrieving integration details for '${intNameOrId
    }. This is sometimes caused by insufficient permissions with your credentials'`;

    return <ComponentContainerError message={errorMsg} />;
  }

  return (
    <HydratedRevisionContext.Provider value={contextValue}>
      { children}
    </HydratedRevisionContext.Provider>
  );
}

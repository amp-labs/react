import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { useQuery } from '@tanstack/react-query';

import { useConnections } from 'context/ConnectionsContextProvider';
import {
  ErrorBoundary, useErrorState,
} from 'context/ErrorContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import {
  HydratedIntegrationRead, HydratedIntegrationWriteObject, HydratedRevision, useAPI,
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

const useHydratedRevisionQuery = (
  projectIdOrName?: string,

) => {
  const getAPI = useAPI();
  const { selectedConnection } = useConnections();
  const { integrationId, integrationObj } = useInstallIntegrationProps();

  const connectionId = selectedConnection?.id;
  const revisionId = integrationObj?.latestRevision?.id;

  return useQuery({
    queryKey: ['amp', 'hydratedRevision', projectIdOrName, integrationId, revisionId],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error('projectIdOrName is required');
      if (!integrationId) throw new Error('integrationId is required');
      if (!revisionId) throw new Error('revisionId is required');
      if (!connectionId) throw new Error('connectionId is required');

      const api = await getAPI();
      return api.revisionApi.getHydratedRevision({
        projectIdOrName,
        integrationId,
        revisionId,
        connectionId,
      });
    },
    enabled: !!projectIdOrName && !!integrationId && !!revisionId && !!connectionId,
  });
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
  const { isError, removeError, setError } = useErrorState();
  const errorIntegrationIdentifier = integrationObj?.name || integrationId;

  const {
    data: hydratedRevision,
    isLoading: loading, isError: isHydratedRevisionError,
    error: hydrateRevisionError,
  } = useHydratedRevisionQuery(projectId || undefined);

  useEffect(() => {
    if (isHydratedRevisionError) {
      setError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
      handleServerError(hydrateRevisionError);
    } else {
      removeError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
    }
  }, [isHydratedRevisionError, errorIntegrationIdentifier, setError, removeError, hydrateRevisionError]);

  const contextValue = useMemo(() => ({
    hydratedRevision: hydratedRevision || null,
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

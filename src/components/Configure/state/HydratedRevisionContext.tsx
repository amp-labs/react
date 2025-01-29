import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useConnections } from 'context/ConnectionsContextProvider';
import {
  ErrorBoundary, useErrorState,
} from 'context/ErrorContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import {
  api, HydratedIntegrationRead, HydratedIntegrationWriteObject, HydratedRevision, useAPI,
} from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

import { ComponentContainerError } from '../ComponentContainer';

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
  projectId?: string,
  integrationId?: string,
  revisionId?: string,
  connectionId?: string,
) => {
  const getApi = useAPI();

  return useQuery({
    queryKey: ['amp', 'hydratedRevision', projectId, integrationId, revisionId, connectionId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID not found.');
      if (!integrationId) throw new Error('Integration ID not found.');
      if (!revisionId) throw new Error('Revision ID not found.');
      if (!connectionId) throw new Error('Connection ID not found.');

      const apiClient = await getApi();
      return apiClient.revisionApi.getHydratedRevision({
        projectIdOrName: projectId,
        integrationId,
        revisionId,
        connectionId,
      });
    },
    enabled: !!projectId && !!integrationId && !!revisionId && !!connectionId,
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
  const { selectedConnection } = useConnections();
  const { integrationId, integrationObj } = useInstallIntegrationProps();
  const { isError, removeError, setError } = useErrorState();

  const connectionId = selectedConnection?.id;
  const revisionId = integrationObj?.latestRevision?.id;
  const {
    data: hydratedRevision,
    isLoading: loading,
    isError: isHydratedRevisionError,
    error: hydratedRevisionError,
  } = useHydratedRevisionQuery(projectId || '', integrationId, revisionId, connectionId);

  const errorIntegrationIdentifier = integrationObj?.name || integrationId;

  useEffect(() => {
    if (isHydratedRevisionError) {
      console.error(`Error loading integration ${errorIntegrationIdentifier}.`);
      handleServerError(hydratedRevisionError);
      setError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
    } else {
      removeError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
    }
  }, [isError, errorIntegrationIdentifier, hydratedRevisionError, removeError, setError, isHydratedRevisionError]);

  const contextValue = useMemo(() => ({
    hydratedRevision: hydratedRevision || null,
    loading,
    readAction: hydratedRevision?.content?.read,
    writeObjects: hydratedRevision?.content?.write?.objects || [],
  }), [hydratedRevision, loading]);

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

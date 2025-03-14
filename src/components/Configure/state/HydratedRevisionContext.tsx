import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useConnections } from 'context/ConnectionsContextProvider';
import {
  ErrorBoundary, useErrorState,
} from 'context/ErrorContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import {
  HydratedIntegrationRead, HydratedIntegrationWriteObject, HydratedRevision, useAPI,
} from 'services/api';
import { ComponentContainerError, ComponentContainerLoading } from 'src/components/Configure/ComponentContainer';
import { RemoveConnectionButton } from 'src/components/Connect/RemoveConnectionButton';
import { InnerErrorTextBox } from 'src/components/ErrorTextBox/ErrorTextBox';
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

const useHydratedRevisionQuery = () => {
  const queryClient = useQueryClient();
  const getAPI = useAPI();
  const { selectedConnection, isConnectionsLoading } = useConnections();
  const { projectIdOrName } = useProject();
  const { integrationId, integrationObj } = useInstallIntegrationProps();

  const connectionId = selectedConnection?.id;
  const revisionId = integrationObj?.latestRevision?.id;

  useEffect(() => {
    if (!connectionId) {
      // clear the query cache if connectionId is not set (includes resetting cached errors)
      queryClient.invalidateQueries({ queryKey: ['amp', 'hydratedRevision'] });
    }
  }, [connectionId, queryClient]);

  return useQuery({
    queryKey: ['amp', 'hydratedRevision', projectIdOrName, integrationId, revisionId, connectionId],
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
    retry: 3, // retry 3 times before showing error
    enabled: !!projectIdOrName && !!integrationId && !!revisionId && !!connectionId && !isConnectionsLoading,
  });
};

type HydratedRevisionProviderProps = {
  children?: React.ReactNode;
  resetComponent: () => void; // optional prop to reset the component on error
};

export function HydratedRevisionProvider({
  children, resetComponent,
}: HydratedRevisionProviderProps) {
  const { integrationId, integrationObj } = useInstallIntegrationProps();
  const { isError, removeError, setError } = useErrorState();
  const errorIntegrationIdentifier = integrationObj?.name || integrationId;
  const [readeableErrorMsg, setReadableErrorMsg] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const {
    data: hydratedRevision,
    isLoading: loading, isError: isHydratedRevisionError,
    error: hydrateRevisionError,
  } = useHydratedRevisionQuery();

  useEffect(() => {
    if (isHydratedRevisionError) {
      setError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
      handleServerError(hydrateRevisionError, setReadableErrorMsg);
    } else {
      removeError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
      setReadableErrorMsg(null);
      setConnectionError(null);
    }
  }, [isHydratedRevisionError, errorIntegrationIdentifier,
    setError, removeError, hydrateRevisionError, setReadableErrorMsg]);

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
    }. This is sometimes caused by insufficient permissions with your credentials. ' 
    ${readeableErrorMsg ? `: ${readeableErrorMsg}` : ''}`;

    return (
      <ComponentContainerError message={errorMsg}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem',
        }}
        >
          {connectionError && <InnerErrorTextBox message={connectionError} />}
          <RemoveConnectionButton
            buttonText="Remove Connection"
            resetComponent={resetComponent}
            buttonVariant="danger"
            onDisconnectError={(error: string) => setConnectionError(error)}
          />
        </div>
      </ComponentContainerError>
    );
  }

  return (
    <HydratedRevisionContext.Provider value={contextValue}>
      { children}
    </HydratedRevisionContext.Provider>
  );
}

import {
  createContext, useContext, useEffect,
  useMemo,
} from 'react';
import { useQuery } from '@tanstack/react-query';

import { Integration, useAPI } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

import { ErrorBoundary, useErrorState } from './ErrorContextProvider';
import { useProject } from './ProjectContextProvider';

interface IntegrationListContextValue {
  integrations: Integration[] | null;
  isLoading: boolean;
}

export const IntegrationListContext = createContext<IntegrationListContextValue>({
  integrations: null,
  isLoading: true,
});

export const useIntegrationList = (): IntegrationListContextValue => {
  const context = useContext(IntegrationListContext);

  if (!context) {
    throw new Error('useIntegrationList must be used within a IntegrationListProvider');
  }

  return context;
};

function useListIntegrationsQuery() {
  const getAPI = useAPI();
  const { projectIdOrName } = useProject();

  return useQuery({
    queryKey: ['amp', 'integrations', projectIdOrName],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error('Project ID or name is required');
      const api = await getAPI();
      return api.integrationApi.listIntegrations({ projectIdOrName });
    },
    enabled: !!projectIdOrName,
  });
}

type IntegrationListContextProviderProps = {
  children?: React.ReactNode;
};

export function IntegrationListProvider(
  { children }: IntegrationListContextProviderProps,
) {
  const { projectIdOrName } = useProject();
  const { setError, removeError } = useErrorState();
  const { data: integrations, isLoading, isError } = useListIntegrationsQuery();

  useEffect(() => {
    if (isError) {
      handleServerError(isError);
      setError(ErrorBoundary.INTEGRATION_LIST, projectIdOrName);
    } else {
      removeError(ErrorBoundary.INTEGRATION_LIST, projectIdOrName);
    }
  }, [isError, projectIdOrName, removeError, setError]);

  const contextValue = useMemo(() => ({
    integrations: integrations || null,
    isLoading,
  }), [integrations, isLoading]);

  return (
    <IntegrationListContext.Provider value={contextValue}>
      { children}
    </IntegrationListContext.Provider>
  );
}

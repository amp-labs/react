import {
  createContext, useContext, useEffect,
  useMemo,
} from 'react';

import { useListIntegrationsQuery } from 'hooks/query/useIntegrationListQuery';
import { Integration } from 'services/api';
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

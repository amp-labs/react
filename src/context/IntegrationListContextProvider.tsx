import {
  createContext, useContext, useEffect,
  useMemo, useState,
} from 'react';

import { api, Integration } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

import { useApiKey } from './ApiKeyContextProvider';
import { ErrorBoundary, useErrorState } from './ErrorContextProvider';

interface IntegrationListContextValue {
  integrations: Integration[] | null;
  isLoading: boolean;
}

export const IntegrationListContext = createContext<IntegrationListContextValue>({
  integrations: null,
  isLoading: false,
});

export const useIntegrationList = (): IntegrationListContextValue => {
  const context = useContext(IntegrationListContext);

  if (!context) {
    throw new Error('useIntegrationList must be used within a IntegrationListProvider');
  }

  return context;
};

type IntegrationListContextProviderProps = {
  projectIdOrName: string,
  children?: React.ReactNode;
};

export function IntegrationListProvider(
  { projectIdOrName, children }: IntegrationListContextProviderProps,
) {
  const apiKey = useApiKey();
  const { setError } = useErrorState();
  const [integrations, setIntegrations] = useState<Integration[] | null>(null);
  const [isLoading, setLoadingState] = useState<boolean>(true);

  useEffect(() => {
    api().integrationApi.listIntegrations({ projectIdOrName }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_integrations) => {
      setLoadingState(false);
      setIntegrations(_integrations || []);
    }).catch((err) => {
      console.error('Error retrieving integration information.');
      handleServerError(err);
      setLoadingState(false);
      setError(ErrorBoundary.INTEGRATION_LIST, projectIdOrName);
    });
  }, [projectIdOrName, apiKey, setError]);

  const contextValue = useMemo(() => ({
    integrations, isLoading,
  }), [integrations, isLoading]);

  return (
    <IntegrationListContext.Provider value={contextValue}>
      { children}
    </IntegrationListContext.Provider>
  );
}

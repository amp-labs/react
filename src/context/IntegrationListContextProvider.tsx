import {
  createContext, useContext, useEffect,
  useMemo, useState,
} from 'react';

import { LoadingIcon } from 'assets/LoadingIcon';
import { ErrorTextBox } from 'components/ErrorTextBox';
import { api, Integration } from 'services/api';

import { useApiKey } from './ApiKeyContextProvider';
import { ErrorBoundary, useErrorState } from './ErrorContextProvider';

interface IntegrationListContextValue {
  integrations: Integration[] | null;
}

export const IntegrationListContext = createContext<IntegrationListContextValue>({
  integrations: null,
});

export const useIntegrationList = (): IntegrationListContextValue => {
  const context = useContext(IntegrationListContext);

  if (!context) {
    throw new Error('useIntegrationList must be used within a IntegrationListProvider');
  }

  return context;
};

type IntegrationListContextProviderProps = {
  projectId: string,
  children?: React.ReactNode;
};

export function IntegrationListProvider(
  { projectId, children }: IntegrationListContextProviderProps,
) {
  const apiKey = useApiKey();
  const { setError, isError } = useErrorState();
  const [integrations, setIntegrations] = useState<Integration[] | null>(null);
  const [isLoading, setLoadingState] = useState<boolean>(true);

  useEffect(() => {
    api().integrationApi.listIntegrations({ projectIdOrName: projectId }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_integrations) => {
      setLoadingState(false);
      setIntegrations(_integrations || []);
    }).catch((err) => {
      setLoadingState(false);
      setError(ErrorBoundary.INTEGRATION_LIST, projectId);
      console.error('Error retrieving integration information for : ', err);
    });
  }, [projectId, apiKey, setError]);

  const contextValue = useMemo(() => ({
    integrations,
  }), [integrations]);

  return (
    isError(ErrorBoundary.INTEGRATION_LIST, projectId)
      ? <ErrorTextBox message="Error retrieving integrations for the project, double check the API key" />
      : (
        <IntegrationListContext.Provider value={contextValue}>
          {isLoading ? <LoadingIcon /> : children}
        </IntegrationListContext.Provider>
      )
  );
}

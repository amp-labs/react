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
  projectIdOrName: string,
  children?: React.ReactNode;
};

export function IntegrationListProvider(
  { projectIdOrName, children }: IntegrationListContextProviderProps,
) {
  const apiKey = useApiKey();
  const { setError, isError } = useErrorState();
  const [integrations, setIntegrations] = useState<Integration[] | null>(null);
  const [isLoading, setLoadingState] = useState<boolean>(true);

  useEffect(() => {
    api().integrationApi.listIntegrations({ projectIdOrName: projectIdOrName }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_integrations) => {
      setLoadingState(false);
      setIntegrations(_integrations || []);
    }).catch((err) => {
      setLoadingState(false);
      setError(ErrorBoundary.INTEGRATION_LIST, projectIdOrName);
      console.error('Error retrieving integration information for : ', err);
    });
  }, [projectIdOrName, apiKey, setError]);

  const contextValue = useMemo(() => ({
    integrations,
  }), [integrations]);

  return (
    isError(ErrorBoundary.INTEGRATION_LIST, projectIdOrName)
      ? <ErrorTextBox message="Error retrieving integrations for the project, double check the API key" />
      : (
        <IntegrationListContext.Provider value={contextValue}>
          {isLoading ? <LoadingIcon /> : children}
        </IntegrationListContext.Provider>
      )
  );
}

import {
  createContext, useContext, useEffect,
  useMemo, useState,
} from 'react';

import { api, Integration } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';

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
  const [integrations, setIntegrations] = useState<Integration[] | null>(null);
  const apiKey = useContext(ApiKeyContext);

  useEffect(() => {
    api.listIntegrations({ projectId }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_integrations) => {
      setIntegrations(_integrations || []);
    }).catch((err) => {
      console.error('ERROR: ', err);
    });
  }, [projectId, apiKey]);

  const contextValue = useMemo(() => ({
    integrations,
  }), [integrations]);

  return (
    <IntegrationListContext.Provider value={contextValue}>
      {children}
    </IntegrationListContext.Provider>
  );
}

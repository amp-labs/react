import {
  createContext, useContext, useEffect,
  useMemo, useState,
} from 'react';

import { api, Integration } from '../services/api';

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
  projectID: string,
  apiKey: string,
  children?: React.ReactNode;
};

export function IntegrationListProvider(
  { projectID, apiKey, children }: IntegrationListContextProviderProps,
) {
  const [integrations, setIntegrations] = useState<Integration[] | null>(null);

  useEffect(() => {
    api.listIntegrations({ projectId: projectID }).then((_integrations) => {
      setIntegrations(_integrations || []);
    }).catch((err) => {
      console.error('ERROR: ', err);
    });
  }, [projectID, apiKey]);

  const contextValue = useMemo(() => ({
    integrations,
  }), [integrations]);

  return (
    <IntegrationListContext.Provider value={contextValue}>
      {children}
    </IntegrationListContext.Provider>
  );
}

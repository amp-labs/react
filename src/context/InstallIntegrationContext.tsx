import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { api, Installation, Integration } from '../services/api';
import { findIntegrationFromList } from '../utils';

import { ApiKeyContext } from './ApiKeyContext';
import { useIntegrationList } from './IntegrationListContext';
import { useProject } from './ProjectContext';

// Define the context value type
interface InstallIntegrationContextValue {
  integrationId: string;
  provider: string;
  integrationObj: Integration | null;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  installation: Installation | undefined;
}
// Create a context to pass down the props
const InstallIntegrationContext = createContext<InstallIntegrationContextValue>({
  integrationId: '',
  provider: '',
  integrationObj: null,
  consumerRef: '',
  consumerName: '',
  groupRef: '',
  groupName: '',
  installation: undefined,
});

// Create a custom hook to access the props
export function useInstallIntegrationProps() {
  const context = useContext(InstallIntegrationContext);
  if (!context) {
    throw new Error('useInstallIntegrationProps must be used within an InstallIntegrationProvider');
  }
  return context;
}

interface InstallIntegrationProviderProps {
  integration: string, // integration name
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  children: React.ReactNode,
}

// Wrap your parent component with the context provider
export function InstallIntegrationProvider({
  children, integration, consumerRef, consumerName, groupRef, groupName,
}: InstallIntegrationProviderProps) {
  const { projectId } = useProject();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const installation = installations?.[0] || null; // there should only be one installation for mvp
  const apiKey = useContext(ApiKeyContext);
  const { integrations } = useIntegrationList();
  const integrationObj = useMemo(
    () => findIntegrationFromList(integration, integrations || []),
    [integration, integrations],
  );

  // check if integration has been installed in AmpersandProvider
  useEffect(() => {
    if (integrationObj?.id) {
      // check if installation exists on selected integration
      api().listInstallations({ projectId, integrationId: integrationObj.id, groupRef }, {
        headers: {
          'X-Api-Key': apiKey ?? '',
        },
      })
        .then((_installations) => { setInstallations(_installations || []); })
        .catch((err) => { console.error('ERROR: ', err); });
    }
  }, [projectId, integrationObj?.id, apiKey, groupRef]);

  const props = useMemo(() => ({
    integrationId: integrationObj?.id || '',
    provider: integrationObj?.provider || '',
    integrationObj: integrationObj || null,
    consumerRef,
    consumerName,
    groupRef,
    groupName,
    installation,
  }), [integrationObj, consumerRef, consumerName, groupRef, groupName, installation]);

  return (
    <InstallIntegrationContext.Provider value={props}>
      {children}
    </InstallIntegrationContext.Provider>
  );
}

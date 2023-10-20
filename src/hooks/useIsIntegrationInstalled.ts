import {
  useContext,
  useEffect, useMemo,
  useState,
} from 'react';

import { ApiKeyContext } from '../context/ApiKeyContext';
import { useIntegrationList } from '../context/IntegrationListContext';
import { useProject } from '../context/ProjectContext';
import { api, Installation, Integration } from '../services/api';

interface UseIsIntegrationInstalledResult {
  isLoaded: boolean;
  isIntegrationInstalled: boolean | null;
}

export const useIsIntegrationInstalled = (
  integration: string,
  groupRef: string,
): UseIsIntegrationInstalledResult => {
  const apiKey = useContext(ApiKeyContext);
  const { projectId } = useProject();
  const { integrations } = useIntegrationList();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIntegrationInstalled, setIsIntegrationInstalled] = useState<boolean | null>(null);

  if (!apiKey || !projectId) {
    throw new Error('useIsIntegrationInstalled must be used within AmpersandProvider');
  }

  if (!integration) {
    throw new Error('useIsIntegrationInstalled requires an integration name');
  }

  if (!groupRef) {
    throw new Error('useIsIntegrationInstalled requires a groupRef');
  }

  const integrationToCheck = useMemo(() => integrations?.reduce(
    (
      acc: Integration,
      _integration: Integration,
    ) => (
      _integration?.name === integration
        ? _integration
        : acc),
    {} as Integration,
  ), [integrations]);

  useEffect(() => {
    if (!integrationToCheck) return;

    api().listInstallations({
      projectId,
      integrationId: integrationToCheck.id,
      groupRef,
    }, {
      headers: {
        'x-api-key': apiKey,
      },
    }).then((installationList: Installation[]) => {
      setIsLoaded(true);
      setIsIntegrationInstalled(installationList.length > 0);
    }).catch((err) => {
      console.error('Error listing installations: ', err);
      setIsLoaded(true);
    });
  }, [groupRef, apiKey, projectId, integrationToCheck]);

  return { isLoaded, isIntegrationInstalled };
};

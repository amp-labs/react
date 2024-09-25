import { useEffect, useMemo, useState } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useIntegrationList } from 'context/IntegrationListContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api, Installation, Integration } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

interface UseIsIntegrationInstalledResult {
  isLoaded: boolean;
  isIntegrationInstalled: boolean | null;
}

export const useIsIntegrationInstalled = (
  integration: string,
  groupRef: string,
): UseIsIntegrationInstalledResult => {
  const apiKey = useApiKey();
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
  ), [integrations, integration]);

  useEffect(() => {
    if (!integrationToCheck) return;

    api().installationApi.listInstallations({
      projectIdOrName: projectId,
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
      console.error('Error listing installations.');
      handleServerError(err);
      setIsLoaded(true);
    });
  }, [groupRef, apiKey, projectId, integrationToCheck]);

  return { isLoaded, isIntegrationInstalled };
};

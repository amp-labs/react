import {
  useContext,
  useEffect, useState,
} from 'react';

import { ApiKeyContext } from '../context/ApiKeyContext';
import { useIntegrationList } from '../context/IntegrationListContext';
import { useProject } from '../context/ProjectContext';
import { api, Installation, Integration } from '../services/api';

interface UseIsIntegrationInstalled {
  isLoaded: boolean;
  isIntegrationInstalled: boolean;
}

export const useIsIntegrationInstalled = (
  integration: string,
  groupRef: string,
): UseIsIntegrationInstalled => {
  if (!integration) {
    throw new Error('useIsIntegrationInstalled requires an integration name');
  }

  if (!groupRef) {
    throw new Error('useIsIntegrationInstalled requires a groupRef');
  }

  const apiKey = useContext(ApiKeyContext);
  if (!apiKey) {
    throw new Error('useIsIntegrationInstalled requires an ApiKeyContext');
  }

  const { projectId } = useProject();
  if (!projectId) {
    throw new Error('useIsIntegrationInstalled requires a projectId');
  }

  const { integrations } = useIntegrationList();
  const [isLoaded, setIsLoaded] = useState(
    false,
  );

  const [installations, setInstallations] = useState<Installation[]>([]);

  const integrationToCheck = integrations?.reduce(
    (
      acc: Integration,
      _integration: Integration,
    ) => (
      _integration?.name === integration
        ? _integration
        : acc),
    {} as Integration,
  );

  useEffect(() => {
    if (!apiKey) return;
    if (!integrationToCheck) return;
    if (!projectId) return;

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
      setInstallations(installationList);
    }).catch((err) => {
      console.error('Error listing installations: ', err);
      setIsLoaded(true);
    });
  }, [integrations, integration, groupRef, apiKey, projectId, integrationToCheck]);

  if (!isLoaded) {
    return { isLoaded: false, isIntegrationInstalled: false };
  }
  return { isLoaded: true, isIntegrationInstalled: installations.length > 0 };
};

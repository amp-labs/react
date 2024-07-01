import {
  api, Config, CreateInstallationOperationRequest,
  CreateInstallationRequestConfig, Installation,
} from '../../../../services/api';

export type CreateInstallationSharedProps = {
  projectId: string;
  integrationId: string;
  groupRef: string;
  connectionId: string;
  apiKey: string;
  setInstallation: (installationObj: Installation) => void;
  onInstallSuccess?: (installationId: string, config: Config) => void;
};

type CreateInstallationAndSetStateProps = CreateInstallationSharedProps & {
  createConfig: CreateInstallationRequestConfig;
};

export function createInstallationAndSetState(
  {
    createConfig, projectId, integrationId, groupRef, connectionId, apiKey, setInstallation, onInstallSuccess,
  }: CreateInstallationAndSetStateProps,
) {
  const createInstallationRequest: CreateInstallationOperationRequest = {
    projectIdOrName: projectId,
    integrationId,
    installation: {
      groupRef,
      connectionId,
      config: createConfig,
    },
  };

  return api().installationApi.createInstallation(createInstallationRequest, {
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
  })
    .then((installation) => {
      // update local installation state
      setInstallation(installation);
      onInstallSuccess?.(installation.id, installation.config);
    })
    .catch((err) => {
      console.error('ERROR: ', err);
    });
}

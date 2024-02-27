import {
  api, Config, Installation,
  UpdateInstallationOperationRequest,
  UpdateInstallationRequestInstallationConfig,
} from '../../../services/api';

type UpdateInstallationSharedProps = {
  projectId: string;
  integrationId: string;
  installationId: string;
  apiKey: string;
  selectedObjectName: string;
  setInstallation: (installationObj: Installation) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
};
type UpdateInstallationReducer = UpdateInstallationSharedProps & {
  updateConfig: UpdateInstallationRequestInstallationConfig;
};
export function updateInstallationReducer({
  updateConfig, projectId, integrationId, installationId, apiKey, selectedObjectName, setInstallation, onUpdateSuccess,
}: UpdateInstallationReducer) {
  const updateInstallationRequest: UpdateInstallationOperationRequest = {
    projectId,
    installationId,
    integrationId,
    installationUpdate: {
      // update mask will recurse to the object path and replace the object at the object path
      // this example will replace the object at the object (i.e. accounts)
      updateMask: [`config.content.read.standardObjects.${selectedObjectName}`],
      installation: {
        config: updateConfig,
      },
    },
  };

  // call api.updateInstallation
  return api().installationApi.updateInstallation(updateInstallationRequest, {
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
  }).then((installation) => {
    // update local installation state
    setInstallation(installation);
    onUpdateSuccess?.(installation.id, installation.config);
  }).catch((err) => {
    console.error('ERROR: ', err);
  });
}

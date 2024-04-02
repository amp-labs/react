import {
  api, Config, Installation,
  UpdateInstallationOperationRequest,
  UpdateInstallationRequestInstallationConfig,
} from '../../../../services/api';

type UpdateInstallationSharedProps = {
  projectId: string;
  integrationId: string;
  installationId: string;
  apiKey: string;
  selectedObjectName: string;
  setInstallation: (installationObj: Installation) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
};
type UpdateInstallationAndSetStateProps = UpdateInstallationSharedProps & {
  updateConfig: UpdateInstallationRequestInstallationConfig;
};
export function updateInstallationAndSetState({
  updateConfig, projectId, integrationId, installationId, apiKey, selectedObjectName, setInstallation, onUpdateSuccess,
}: UpdateInstallationAndSetStateProps) {
  const updateInstallationRequest: UpdateInstallationOperationRequest = {
    projectId,
    installationId,
    integrationId,
    installationUpdate: {
      // update mask will recurse to the object path and replace the object at the object path
      updateMask: [
        // `config.content.read.standardObjects.${selectedObjectName}`,
        `config.content.read.objects.${selectedObjectName}`,

      ],
      installation: {
        config: updateConfig,
      },
    },
  };

  console.log("about to call updateInstallation with request: ", JSON.stringify(updateInstallationRequest, null, 2))

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

import {
  api,
  Config,
  Installation,
  UpdateInstallationOperationRequest,
  UpdateInstallationRequestInstallationConfig,
} from "services/api";
import { escapeObjectName } from "src/utils";
import { handleServerError } from "src/utils/handleServerError";

type UpdateInstallationSharedProps = {
  projectId: string;
  integrationId: string;
  installationId: string;
  apiKey: string;
  selectedObjectName: string;
  setError: (error: string) => void;
  setInstallation: (installationObj: Installation) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
};
type UpdateInstallationAndSetStateProps = UpdateInstallationSharedProps & {
  updateConfig: UpdateInstallationRequestInstallationConfig;
};
export function updateInstallationAndSetState({
  updateConfig,
  projectId,
  integrationId,
  installationId,
  apiKey,
  selectedObjectName,
  setInstallation,
  onUpdateSuccess,
  setError,
}: UpdateInstallationAndSetStateProps) {
  const updateInstallationRequest: UpdateInstallationOperationRequest = {
    projectIdOrName: projectId,
    installationId,
    integrationId,
    installationUpdate: {
      // update mask will recurse to the object path and replace the object at the object path
      // this example will replace the object at the object (i.e. accounts)
      updateMask: [
        `config.content.read.objects.${escapeObjectName(selectedObjectName)}`,
      ],
      installation: {
        config: updateConfig,
      },
    },
  };

  // call api.updateInstallation
  return api()
    .installationApi.updateInstallation(updateInstallationRequest, {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    })
    .then((installation) => {
      // update local installation state
      setInstallation(installation);
      onUpdateSuccess?.(installation.id, installation.config);
    })
    .catch((err) => {
      handleServerError(err, setError);
    });
}

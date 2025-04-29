import {
  api,
  Config,
  CreateInstallationOperationRequest,
  CreateInstallationRequestConfig,
  Installation,
} from "services/api";
import { handleServerError } from "src/utils/handleServerError";

export type CreateInstallationSharedProps = {
  projectId: string;
  integrationId: string;
  groupRef: string;
  connectionId: string;
  apiKey: string;
  setError: (error: string) => void;
  setInstallation: (installationObj: Installation) => void;
  onInstallSuccess?: (installationId: string, config: Config) => void;
};

type CreateInstallationAndSetStateProps = CreateInstallationSharedProps & {
  createConfig: CreateInstallationRequestConfig;
};

export async function createInstallationAndSetState({
  createConfig,
  projectId,
  integrationId,
  groupRef,
  connectionId,
  apiKey,
  setError,
  setInstallation,
  onInstallSuccess,
}: CreateInstallationAndSetStateProps) {
  const createInstallationRequest: CreateInstallationOperationRequest = {
    projectIdOrName: projectId,
    integrationId,
    installation: {
      groupRef,
      connectionId,
      config: createConfig,
    },
  };

  try {
    const installation = await api().installationApi.createInstallation(
      createInstallationRequest,
      {
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
      },
    );
    setInstallation(installation);
    onInstallSuccess?.(installation.id, installation.config);
  } catch (error) {
    handleServerError(error, setError);
  }
}

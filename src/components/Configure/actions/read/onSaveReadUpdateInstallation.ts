import {
  BackfillConfig,
  Config,
  HydratedIntegrationObject,
  HydratedRevision,
  Installation,
  UpdateInstallationRequestInstallationConfig,
} from "services/api";

import {
  generateSelectedFieldMappingsFromConfigureState,
  generateSelectedFieldsFromConfigureState,
  generateSelectedValuesMappingsFromConfigureState,
} from "../../state/utils";
import { ConfigureState } from "../../types";
import { updateInstallationAndSetState } from "../mutateAndSetState/updateInstallationAndSetState";
import { getIsProxyEnabled } from "../proxy/isProxyEnabled";

/**
 * given a configureState, config, and objectName, generate the config object that is need for
 * update installation request.
 *
 * 1. get required fields from configureState
 * 2. get optional fields from configureState
 * 3. merge required fields and optional fields into selectedFields
 * 4. get required custom map fields from configureState
 * 5. generate modified config object based on update mask
 * @param configureState
 * @param config
 * @param objectName
 * @param hydratedObject
 * @returns
 */
export const generateUpdateReadConfigFromConfigureState = (
  configureState: ConfigureState,
  objectName: string,
  hydratedRevision: HydratedRevision,
  backfill?: BackfillConfig,
): UpdateInstallationRequestInstallationConfig => {
  const selectedFields =
    generateSelectedFieldsFromConfigureState(configureState);
  const selectedFieldMappings =
    generateSelectedFieldMappingsFromConfigureState(configureState);
  const selectedValuesMappings =
    generateSelectedValuesMappingsFromConfigureState(configureState);

  // config request object type needs to be fixed
  const updateConfigObject: UpdateInstallationRequestInstallationConfig = {
    content: {
      read: {
        objects: {
          [objectName]: {
            objectName,
            selectedFields,
            selectedFieldMappings,
            selectedValueMappings: selectedValuesMappings || {},
            backfill,
          },
        },
      },
    },
  };

  // insert proxy into config if it is enabled
  const isProxyEnabled = getIsProxyEnabled(hydratedRevision);

  if (isProxyEnabled) {
    if (!updateConfigObject.content) updateConfigObject.content = {};
    updateConfigObject.content.proxy = { enabled: true };
  }

  return updateConfigObject;
};

export const onSaveReadUpdateInstallation = (
  projectIdOrName: string,
  integrationId: string,
  installationId: string,
  selectedObjectName: string,
  apiKey: string,
  configureState: ConfigureState,
  setInstallation: (installationObj: Installation) => void,
  hydratedObject: HydratedIntegrationObject,
  hydratedRevision: HydratedRevision,
  setError: (error: string) => void,
  onUpdateSuccess?: (installationId: string, config: Config) => void,
): Promise<void | null> => {
  // get configuration state
  // transform configuration state to update shape
  const updateConfig = generateUpdateReadConfigFromConfigureState(
    configureState,
    selectedObjectName || "",
    hydratedRevision,
    hydratedObject.backfill,
  );

  if (!updateConfig) {
    console.error("Error when generating updateConfig from configureState");
    return Promise.resolve(null);
  }

  return updateInstallationAndSetState({
    updateConfig,
    projectIdOrName,
    integrationId,
    installationId,
    apiKey,
    selectedObjectName,
    setError,
    setInstallation,
    onUpdateSuccess,
  });
};

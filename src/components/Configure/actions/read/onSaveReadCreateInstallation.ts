import {
  Config,
  CreateInstallationRequestConfig,
  HydratedRevision,
  Installation,
} from "services/api";

import {
  generateSelectedFieldMappingsFromConfigureState,
  generateSelectedFieldsFromConfigureState,
  generateSelectedValuesMappingsFromConfigureState,
} from "../../state/utils";
import { ConfigureState } from "../../types";
import { createInstallationAndSetState } from "../mutateAndSetState/createInstallationAndSetState";
import { getIsProxyEnabled } from "../proxy/isProxyEnabled";
/**
 * gets matching object from hydratedRevision
 * @param hydratedRevision
 * @param objectName
 * @returns
 */
const getObjectFromHydratedRevision = (
  hydratedRevision: HydratedRevision,
  objectName: string,
) => {
  const readAction = hydratedRevision.content.read;
  const objects = readAction?.objects;
  return objects?.find((obj) => obj.objectName === objectName);
};

/**
 * given a configureState, objectName, hyrdatedRevision, and consumerRef
 * generate the config object that is need for update installation request.
 *
 * 1. get required fields from configureState
 * 2. get optional fields from configureState
 * 3. merge required fields and optional fields into selectedFields
 * 4. get required custom map fields from configureState
 * 5. generate create config object
 * @param configureState
 * @param objectName
 * @param hydratedRevision
 * @param consumerRef
 * @returns
 */
export const generateCreateReadConfigFromConfigureState = (
  configureState: ConfigureState,
  objectName: string,
  hydratedRevision: HydratedRevision,
  consumerRef: string,
): CreateInstallationRequestConfig | null => {
  const selectedFields =
    generateSelectedFieldsFromConfigureState(configureState);
  const selectedFieldMappings =
    generateSelectedFieldMappingsFromConfigureState(configureState);
  const selectedValuesMappings =
    generateSelectedValuesMappingsFromConfigureState(configureState);

  const obj = getObjectFromHydratedRevision(hydratedRevision, objectName);
  if (!obj) {
    console.error(
      `Error when getting object from hydratedRevision for objectName: ${objectName}`,
    );
    return null;
  }

  // create config request object
  const createConfigObj: CreateInstallationRequestConfig = {
    revisionId: hydratedRevision.id,
    createdBy: `consumer:${consumerRef}`,
    content: {
      provider: hydratedRevision.content.provider,
      read: {
        objects: {
          [objectName]: {
            objectName,
            schedule: obj.schedule,
            destination: obj.destination,
            selectedFields,
            selectedFieldMappings,
            selectedValueMappings: selectedValuesMappings || {},
            backfill: obj.backfill,
          },
        },
      },
    },
  };

  // insert proxy into config if it is enabled
  const isProxyEnabled = getIsProxyEnabled(hydratedRevision);
  if (isProxyEnabled) {
    createConfigObj.content.proxy = { enabled: true };
  }

  return createConfigObj;
};

export const onSaveReadCreateInstallation = (
  projectIdOrName: string,
  integrationId: string,
  groupRef: string,
  consumerRef: string,
  connectionId: string,
  objectName: string,
  apiKey: string,
  hydratedRevision: HydratedRevision,
  configureState: ConfigureState,
  setError: (error: string) => void,
  setInstallation: (installationObj: Installation) => void,
  onInstallSuccess?: (installationId: string, config: Config) => void, // success callback function
): Promise<void | null> => {
  const createConfig = generateCreateReadConfigFromConfigureState(
    configureState,
    objectName,
    hydratedRevision,
    consumerRef,
  );
  if (!createConfig) {
    console.error("Error when generating createConfig from configureState");
    return Promise.resolve(null);
  }

  return createInstallationAndSetState({
    createConfig,
    projectIdOrName,
    integrationId,
    groupRef,
    connectionId,
    apiKey,
    setError,
    setInstallation,
    onInstallSuccess,
  });
};

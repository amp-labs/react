import {
  CreateInstallationRequestConfig,
  HydratedRevision,
} from "services/api";

import type { FieldMapping } from "../../InstallIntegration";
import {
  generateSelectedFieldMappingsFromConfigureState,
  generateSelectedFieldsFromConfigureState,
  generateSelectedValuesMappingsFromConfigureState,
  getObjectDynamicMappings,
} from "../../state/utils";
import { ConfigureState } from "../../types";
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
  fieldMapping?: FieldMapping,
): CreateInstallationRequestConfig | null => {
  const selectedFields =
    generateSelectedFieldsFromConfigureState(configureState);
  const selectedFieldMappings =
    generateSelectedFieldMappingsFromConfigureState(configureState);
  const dynamicMappingsInput = getObjectDynamicMappings(
    objectName,
    fieldMapping,
  );
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
    createdBy: `consumer:${consumerRef}`,
    content: {
      provider: hydratedRevision.content.provider,
      read: {
        objects: {
          [objectName]: {
            objectName,
            selectedFields,
            selectedFieldMappings,
            dynamicMappingsInput,
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

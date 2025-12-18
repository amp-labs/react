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

/**
 * given a configureState, objectName, hydratedRevision, and consumerRef
 * generate the config object that is need for update installation request.
 *
 * @param configureState
 * @param objectName
 * @param hydratedRevision
 * @param consumerRef
 * @returns CreateInstallationRequestConfig
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
          },
        },
      },
    },
  };

  return createConfigObj;
};

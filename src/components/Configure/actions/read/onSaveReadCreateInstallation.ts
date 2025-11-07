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

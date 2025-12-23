import { UpdateInstallationRequestInstallationConfig } from "services/api";

import type { FieldMapping } from "../../InstallIntegration";
import {
  generateSelectedFieldMappingsFromConfigureState,
  generateSelectedFieldsFromConfigureState,
  generateSelectedValuesMappingsFromConfigureState,
  getObjectDynamicMappings,
} from "../../state/utils";
import { ConfigureState } from "../../types";

/**
 * given a configureState, objectName, and fieldMapping, generate the config object that is need for
 * update installation request.
 *
 * @param configureState
 * @param objectName
 * @param fieldMapping
 * @returns UpdateInstallationRequestInstallationConfig
 */
export const generateUpdateReadConfigFromConfigureState = (
  configureState: ConfigureState,
  objectName: string,
  fieldMapping?: FieldMapping,
): UpdateInstallationRequestInstallationConfig => {
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

  // config request object type needs to be fixed
  const updateConfigObject: UpdateInstallationRequestInstallationConfig = {
    content: {
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

  return updateConfigObject;
};

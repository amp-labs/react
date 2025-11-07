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
 * 1. get required fields from configureState
 * 2. get optional fields from configureState
 * 3. merge required fields and optional fields into selectedFields
 * 4. get required custom map fields from configureState
 * 5. generate modified config object based on update mask
 * @returns
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

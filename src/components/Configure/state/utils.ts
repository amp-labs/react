import {
  Config,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationRead,
  HydratedIntegrationWrite,
  HydratedRevision,
} from "services/api";

import {
  ConfigureState,
  ConfigureStateRead,
  ConfigureStateWrite,
  ObjectConfigurationsState,
  SelectedWriteObjects,
  SelectMappingFields,
  SelectOptionalFields,
} from "../types";
import {
  generateAllNavObjects,
  getFieldKeyValue,
  getObjectFromAction,
  getOptionalFieldsFromObject,
  getOptionalMapFieldsFromObject,
  getRequiredFieldsFromObject,
  getRequiredMapFieldsFromObject,
  isIntegrationFieldMapping,
} from "../utils";

// compares two write objects by checking if they have the same objectNames
// implementation detail: sdk generates selectedValueDefaults, selectedFieldSettings;
// todo: update openapi spec so the generated SDK no longer have
//    undefined values for selectedValueDefaults, selectedFieldSettings
// note: nothing is passing undefined values to the SDK,
//    the SDK is generating fields with undefined values
export function areWriteObjectsEqual(
  prevWriteObjects: SelectedWriteObjects,
  currentWriteObjects: SelectedWriteObjects,
): boolean {
  // check if the write objects have the same objectNames
  // (do not check for equality of the write object selected values, selected fields, etc. yet)
  const prevObjectNames = new Set(
    Object.values(prevWriteObjects).map(
      (writeObject) => writeObject?.objectName,
    ),
  );
  const currentObjectNames = new Set(
    Object.values(currentWriteObjects).map(
      (writeObject) => writeObject?.objectName,
    ),
  );

  return (
    prevObjectNames.size === currentObjectNames.size &&
    [...prevObjectNames].every((name) => currentObjectNames.has(name))
  );
}

const generateConfigurationStateRead = (
  readAction: HydratedIntegrationRead | undefined,
  objectName: string,
  config?: Config,
): ConfigureStateRead | null => {
  if (!readAction) {
    return null;
  }
  // refactor this section to be immutable at hydrated revision level
  const object = getObjectFromAction(readAction, objectName);
  const requiredFields = object && getRequiredFieldsFromObject(object);
  const optionalFields = object && getOptionalFieldsFromObject(object);
  const requiredMapFields = object && getRequiredMapFieldsFromObject(object);
  const optionalMapFields = object && getOptionalMapFieldsFromObject(object);
  /// //////////////////////////////////////////////////////////////////////

  const allFields =
    (object?.allFields as HydratedIntegrationFieldExistent[]) || [];
  const allFieldsMetadata = object?.allFieldsMetadata || {};
  const content = config?.content;
  const selectedValueMappings =
    content?.read?.objects?.[objectName]?.selectedValueMappings || {};
  const selectedFieldMappings =
    content?.read?.objects?.[objectName]?.selectedFieldMappings || {};

  // Get optional fields from saved config (server)
  const serverOptionalSelected = getServerOptionalSelectedFields(
    config,
    { content: { read: readAction } } as HydratedRevision,
    objectName,
  );

  return {
    allFields, // from hydrated revision
    allFieldsMetadata, // from hydrated revision
    requiredFields, // from hydrated revision
    optionalFields, // from hydrated revision
    requiredMapFields, // from hydrated revision
    optionalMapFields, // from hydrated revision
    // selected state
    selectedOptionalFields: serverOptionalSelected,
    selectedFieldMappings,
    selectedValueMappings,
  };
};

const generateConfigurationStateWrite = (
  writeAction: HydratedIntegrationWrite | undefined,
  config?: Config,
): ConfigureStateWrite | null => {
  if (!writeAction) {
    return null;
  }

  const writeObjects = config?.content?.write?.objects;

  return {
    writeObjects: writeAction?.objects || [],
    selectedWriteObjects: writeObjects || {},
  };
};

export function generateConfigurationState(
  hydratedRevision: HydratedRevision,
  objectName: string,
  config?: Config,
): ConfigureState {
  const readAction = hydratedRevision?.content?.read;
  const writeAction = hydratedRevision?.content?.write;

  return {
    read: generateConfigurationStateRead(readAction, objectName, config),
    write: generateConfigurationStateWrite(writeAction, config),
  };
}

// resets configure state for single object to hydrated revision values
export const setHydrateConfigState = (
  hydratedRevision: HydratedRevision,
  config: Config | undefined,
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    configureState: ConfigureState,
  ) => void,
) => {
  const state = generateConfigurationState(
    hydratedRevision,
    selectedObjectName,
    config,
  );
  setConfigureState(selectedObjectName, state);
};

/**
 * resets configure state for all objects in hydrated revision to hydrated revision values
 */

export const resetAllObjectsConfigurationState = (
  hydratedRevision: HydratedRevision,
  config: Config | undefined,
  setObjectConfiguresState: React.Dispatch<
    React.SetStateAction<ObjectConfigurationsState>
  >,
) => {
  // read nav objects from hydrated revision
  const navObjects = generateAllNavObjects(config, hydratedRevision);
  const objectConfigurationsState: ObjectConfigurationsState = {};
  navObjects.forEach(({ name, completed }) => {
    if (completed) {
      objectConfigurationsState[name] = generateConfigurationState(
        hydratedRevision,
        name,
        config,
      );
    }
  });

  setObjectConfiguresState(objectConfigurationsState);
};

/**
 * generates selectedFields object for Config from configureState
 * @param configureState
 * @returns
 */
export const generateSelectedFieldsFromConfigureState = (
  configureState: ConfigureState,
) => {
  const { requiredFields, selectedOptionalFields } = configureState?.read || {};
  const fields = new Set<string>();
  requiredFields?.forEach((field) => fields.add(getFieldKeyValue(field)));

  // convert set to object for config
  const selectedFields = Array.from(fields).reduce(
    (acc, field) => ({
      ...acc,
      [field]: true,
    }),
    {},
  );

  return {
    ...selectedFields,
    ...(selectedOptionalFields || {}), // adds optional fields that are selected (true)
  };
};

/**
 * generates selectedFieldMappings object for Config from configureState
 * @param configureState
 * @returns
 */
export const generateSelectedFieldMappingsFromConfigureState = (
  configureState: ConfigureState,
) => {
  const { selectedFieldMappings: selectedRequiredMapFields } =
    configureState?.read || {};
  // filter out undefined values of selectedRequiredMapFields
  const selectedRequiredMapFieldsSubmit: Record<string, string> = {};
  if (selectedRequiredMapFields) {
    Object.keys(selectedRequiredMapFields).forEach((key) => {
      if (selectedRequiredMapFields[key] !== undefined) {
        selectedRequiredMapFieldsSubmit[key] =
          selectedRequiredMapFields[key] || "";
      } else {
        console.warn(
          `Error undefined when generating selectedRequiredMapFieldsSubmit for key: ${key}`,
        );
      }
    });
  }

  return selectedRequiredMapFieldsSubmit;
};

/**
 * generates selectedValuesMappings object for Config from configureState
 * @param configureState
 * @returns
 */
export const generateSelectedValuesMappingsFromConfigureState = (
  configureState: ConfigureState,
) => {
  const { selectedValueMappings } = configureState?.read || {};
  return selectedValueMappings;
};

/**
 * Get the intersection of fields that are:
 * - optional fields in the hydrated revision
 * - selected fields in the config (includes both required and optional fields)
 * @param config - installation config
 * @param hydratedRevision - hydrated revision data
 * @param objectName - object name to get fields for
 * @returns selected optional fields from server config
 */
export const getServerOptionalSelectedFields = (
  config: Config | undefined,
  hydratedRevision: HydratedRevision,
  objectName: string,
): SelectOptionalFields => {
  if (!config || !hydratedRevision) {
    return {};
  }

  const readAction = hydratedRevision?.content?.read;
  if (!readAction) {
    return {};
  }

  // Get optional fields from hydrated revision
  const object = getObjectFromAction(readAction, objectName);
  const optionalFields = object && getOptionalFieldsFromObject(object);

  // Create a Set of optional field names for O(1) lookup performance
  const optionalFieldNames = new Set(
    optionalFields
      ?.filter(
        (field): field is HydratedIntegrationFieldExistent =>
          !isIntegrationFieldMapping(field) && !!field.fieldName,
      )
      .map((field) => field.fieldName) || [],
  );

  // Get server selected fields from config
  const readSelectedFields =
    config?.content?.read?.objects?.[objectName]?.selectedFields || {};

  // Filter to only include optional fields that are selected
  const serverOptionalSelected = Object.entries(readSelectedFields).reduce(
    (acc, [fieldName, value]) => {
      if (optionalFieldNames.has(fieldName)) {
        acc[fieldName] = value;
      }
      return acc;
    },
    {} as SelectOptionalFields,
  );

  return serverOptionalSelected;
};

/**
 * gets the server field mappings from the installation config
 * @param config - installation config
 * @param objectName - object name to get field mappings for
 * @returns selected field mappings from server config
 */
export const getServerFieldMappings = (
  config: Config | undefined,
  objectName: string,
): SelectMappingFields => {
  if (!config || !objectName) {
    return {};
  }

  // Get server selected field mappings from config
  const serverFieldMappings =
    config?.content?.read?.objects?.[objectName]?.selectedFieldMappings || {};

  return serverFieldMappings;
};

// get configure state of single object
export function getConfigureState(
  objectName: string,
  objectConfigurationsState: ObjectConfigurationsState,
) {
  return objectConfigurationsState[objectName] || undefined;
}

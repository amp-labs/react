import isEqual from 'lodash.isequal';

import {
  Config,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationRead,
  HydratedRevision,
} from '../../../services/api';
import {
  ConfigureState,
  ObjectConfigurationsState,
  SelectMappingFields,
  SelectOptionalFields,
} from '../types';
import {
  generateNavObjects,
  getFieldKeyValue, getOptionalFieldsFromObject,
  getRequiredFieldsFromObject, getRequiredMapFieldsFromObject,
  getStandardObjectFromAction,
} from '../utils';

// uses lodash deep equality check to compare two saved fields objects
export function isFieldObjectEqual(
  prevFields: SelectMappingFields | SelectOptionalFields,
  currentFields: SelectMappingFields | SelectOptionalFields,
): boolean {
  return isEqual(prevFields, currentFields);
}

export function generateConfigurationState(
  action: HydratedIntegrationRead,
  objectName: string,
  config?: Config,
): ConfigureState {
  // refactor this section to be immutable at hydrated revision level
  const object = getStandardObjectFromAction(action, objectName);
  const requiredFields = object && getRequiredFieldsFromObject(object);
  const optionalFields = object && getOptionalFieldsFromObject(object);
  const requiredMapFields = object && getRequiredMapFieldsFromObject(object);
  /// //////////////////////////////////////////////////////////////////////

  const allFields = object?.allFields as HydratedIntegrationFieldExistent[] || [];
  const selectedFields = config?.content?.read?.standardObjects?.[objectName]?.selectedFields || {};
  const selectedFieldMappings = config?.content?.read?.standardObjects?.
    [objectName]?.selectedFieldMappings || {};

  const optionalFieldsSaved = { ...selectedFields };
  const requiredMapFieldsSaved = { ...selectedFieldMappings };

  return {
    read: {
      allFields, // from hydrated revision
      requiredFields, // from hydrated revision
      optionalFields, // from hydrated revision
      requiredMapFields, // from hydrated revision
      // selected state
      selectedOptionalFields: selectedFields,
      selectedFieldMappings,
      isOptionalFieldsModified: false,
      isRequiredMapFieldsModified: false,
      savedConfig: {
        optionalFields: optionalFieldsSaved, // from config
        requiredMapFields: requiredMapFieldsSaved, // from config
      },
    },
  };
}

// resets configure state for single object to hydrated revision values
export const setHydrateConfigState = (
  hydratedRevision: HydratedRevision,
  config: Config | undefined,
  selectedObjectName: string,
  setConfigureState: (objectName: string, configureState: ConfigureState) => void,
) => {
  const readAction = hydratedRevision?.content?.read;
  if (!readAction) {
    return;
  }
  const state = generateConfigurationState(
    readAction,
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
  setObjectConfiguresState: React.Dispatch<React.SetStateAction<ObjectConfigurationsState>>,
) => {
  const navObjects = generateNavObjects(config, hydratedRevision);
  const objectConfigurationsState: ObjectConfigurationsState = {};
  navObjects.forEach(({ name, completed }) => {
    const readAction = hydratedRevision?.content?.read;
    if (completed && readAction) {
      objectConfigurationsState[name] = generateConfigurationState(
        readAction,
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
export const generateSelectedFieldsFromConfigureState = (configureState: ConfigureState) => {
  const { requiredFields, selectedOptionalFields } = configureState?.read || {};
  const fields = new Set<string>();
  requiredFields?.forEach((field) => fields.add(getFieldKeyValue(field)));

  // convert set to object for config
  const selectedFields = Array.from(fields).reduce((acc, field) => ({
    ...acc,
    [field]: true,
  }), {});

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
export const generateSelectedFieldMappingsFromConfigureState = (configureState: ConfigureState) => {
  const { selectedFieldMappings: selectedRequiredMapFields } = configureState?.read || {};
  // filter out undefined values of selectedRequiredMapFields
  const selectedRequiredMapFieldsSubmit : Record<string, string> = {};
  if (selectedRequiredMapFields) {
    Object.keys(selectedRequiredMapFields).forEach(
      (key) => {
        if (selectedRequiredMapFields[key] !== undefined) {
          selectedRequiredMapFieldsSubmit[key] = selectedRequiredMapFields[key] || '';
        } else {
          console.warn(`Error undefined when generating selectedRequiredMapFieldsSubmit for key: ${key}`);
        }
      },
    );
  }

  return selectedRequiredMapFieldsSubmit;
};

// get configure state of single object
export function getConfigureState(
  objectName: string,
  objectConfigurationsState: ObjectConfigurationsState,
) {
  return objectConfigurationsState[objectName] || undefined;
}

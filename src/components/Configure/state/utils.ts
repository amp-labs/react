import isEqual from 'lodash.isequal';

import {
  Config, HydratedIntegrationFieldExistent,
  HydratedIntegrationRead,
  HydratedRevision,
} from '../../../services/api';
import {
  ConfigureState,
  ConfigureStateIntegrationField,
  ConfigureStateMappingIntegrationField,
  ObjectConfigurationsState,
  SavedConfigureFields,
} from '../types';
import {
  generateNavObjects,
  getFieldKeyValue, getOptionalFieldsFromObject,
  getRequiredFieldsFromObject, getRequiredMapFieldsFromObject,
  getStandardObjectFromAction,
  getValueFromConfigCustomMapping, getValueFromConfigExist,
  isIntegrationFieldMapping,
} from '../utils';

export function createSavedFields(
  fields:
  ConfigureStateIntegrationField[] | ConfigureStateMappingIntegrationField[] | null | undefined,
): SavedConfigureFields {
  const savedFields: SavedConfigureFields = {};

  fields?.forEach((field) => {
    const { value } = field;
    if (value) {
      if (isIntegrationFieldMapping(field)) {
        savedFields[field.mapToName] = value;
      } else {
        savedFields[field.fieldName] = value;
      }
    }
  });

  return savedFields;
}

// uses lodash deep equality check to compare two saved fields objects
export function checkFieldsEquality(
  prevFields: SavedConfigureFields,
  currentFields: SavedConfigureFields,
): boolean {
  return isEqual(prevFields, currentFields);
}

export function generateConfigurationState(
  action: HydratedIntegrationRead,
  objectName: string,
  config?: Config,
): ConfigureState {
  const object = getStandardObjectFromAction(action, objectName);

  const requiredFields = object && getRequiredFieldsFromObject(object);
  const optionalFields = object
    ? getOptionalFieldsFromObject(object)?.map((field) => ({
      ...field,
      value: config ? getValueFromConfigExist(
        config,
        objectName,
        // should only use fieldName for existant fields
        getFieldKeyValue(field),
      ) : false,
    })) as ConfigureStateIntegrationField[] : null; // type hack - TODO fix

  // todo map over requiredMapFields and get value from config
  const requiredMapFields = object ? getRequiredMapFieldsFromObject(object)
    ?.map((field) => ({
      ...field,
      value: config ? getValueFromConfigCustomMapping(
        config,
        objectName,
        // should only use mapToName for custom mapping fields
        getFieldKeyValue(field),
      ) : '',
    })) as ConfigureStateMappingIntegrationField[] : null; // type hack - TODO fix

  const allFields = object?.allFields as HydratedIntegrationFieldExistent[] || [];
  const selectedFields = config?.content?.read?.standardObjects?.[objectName]?.selectedFields || {};

  const optionalFieldsSaved = { ...selectedFields };
  const requiredMapFieldsSaved = createSavedFields(requiredMapFields);

  return {
    allFields,
    requiredFields,
    optionalFields,
    requiredMapFields,
    selectedOptionalFields: selectedFields,
    isOptionalFieldsModified: false,
    isRequiredMapFieldsModified: false,
    savedConfig: {
      optionalFields: optionalFieldsSaved,
      requiredMapFields: requiredMapFieldsSaved,
    },
  };
}

// resets configure state for single object to hydrated revision values
export const resetConfigurationState = (
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
  const { requiredFields, selectedOptionalFields } = configureState;
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
  const { requiredMapFields } = configureState;
  const requiredMapFieldsConfig = (requiredMapFields || []).reduce((acc, field) => {
    const key = getFieldKeyValue(field);
    return {
      ...acc,
      [key]: field.value,
    };
  }, {});
  return requiredMapFieldsConfig;
};

/**
 * returns a new configure state with one of its FieldMappings updated with a new value.
 * @param objectName
 * @param value
 * @param configureState
 * @returns
 */
export const setRequiredCustomMapFieldValue = (
  objectName: string,
  value: string,
  configureState: ConfigureState,
) => {
  const { requiredMapFields } = configureState;
  if (requiredMapFields === null) {
    return { isUpdated: false, newState: configureState };
  }

  // flag to know if field was updated
  let isUpdated = false;
  const updatedRequiredMapFields = requiredMapFields.map((field) => {
    // updated field
    if (field.mapToName === objectName) {
      isUpdated = true;
      return {
        ...field,
        value,
      };
    }
    // else return a copy of the field
    return { ...field };
  });

  if (isUpdated) {
    const savedFields = configureState.savedConfig.requiredMapFields;
    const updatedFields = createSavedFields(updatedRequiredMapFields);
    const isModified = !checkFieldsEquality(savedFields, updatedFields);

    const newState = {
      ...configureState,
      requiredMapFields: updatedRequiredMapFields,
      isRequiredMapFieldsModified: isModified,
    };

    return { isUpdated, newState };
  }

  return { isUpdated: false, newState: configureState };
};

// get configure state of single object
export function getConfigureState(
  objectName: string,
  objectConfigurationsState: ObjectConfigurationsState,
) {
  return objectConfigurationsState[objectName] || undefined;
}

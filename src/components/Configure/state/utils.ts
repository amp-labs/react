import {
  Config, HydratedIntegrationAction,
  HydratedIntegrationFieldExistent,
  HydratedRevision,
} from '../../../services/api';
import {
  ConfigureState,
  ConfigureStateIntegrationField,
  ConfigureStateMappingIntegrationField,
  ObjectConfigurationsState,
} from '../types';
import {
  generateNavObjects,
  getActionTypeFromActions, getFieldKeyValue, getOptionalFieldsFromObject,
  getRequiredFieldsFromObject, getRequiredMapFieldsFromObject,
  getStandardObjectFromAction,
  getValueFromConfigCustomMapping, getValueFromConfigExist,
  PLACEHOLDER_VARS,
} from '../utils';

export function generateConfigurationState(
  actions: HydratedIntegrationAction[],
  type: string,
  objectName: string,
  config?: any,
): ConfigureState {
  const action = getActionTypeFromActions(actions, type);
  const object = action && getStandardObjectFromAction(action, objectName);

  const requiredFields = object && getRequiredFieldsFromObject(object);
  let optionalFields = object
    ? getOptionalFieldsFromObject(object)?.map((field) => ({
      ...field,
      value: getValueFromConfigExist(
        config,
        objectName,
        // should only use fieldName for existant fields
        getFieldKeyValue(field),
      ),
    })) as ConfigureStateIntegrationField[] : null; // type hack - TODO fix

  // remove optional fields that are required
  optionalFields = optionalFields?.filter(
    (field) => !!requiredFields?.find(
      (requiredField) => getFieldKeyValue(requiredField) !== getFieldKeyValue(field),
    ),
  ) || [];

  // todo map over requiredMapFields and get value from config
  const requiredMapFields = object ? getRequiredMapFieldsFromObject(object)
    ?.map((field) => ({
      ...field,
      value: getValueFromConfigCustomMapping(
        config,
        objectName,
        // should only use mapToName for custom mapping fields
        getFieldKeyValue(field),
      ),
    })) as ConfigureStateMappingIntegrationField[] : null; // type hack - TODO fix

  const allFields = object?.allFields as HydratedIntegrationFieldExistent[] || [];
  const selectedFields = config?.content?.read?.standardObjects?.[objectName]?.selectedFields || {};

  return {
    allFields,
    requiredFields,
    optionalFields,
    requiredMapFields,
    selectedOptionalFields: selectedFields,
  };
}

// resets configure state for single object to hydrated revision values
export const resetConfigurationState = (
  hydratedRevision: HydratedRevision,
  config: Config | undefined,
  selectedObjectName: string,
  setConfigureState: (objectName: string, configureState: ConfigureState) => void,
) => {
  const hydratedActions = hydratedRevision?.content.actions || []; // read / write / etc...
  const state = generateConfigurationState(
    hydratedActions,
    PLACEHOLDER_VARS.OPERATION_TYPE,
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
    if (completed) {
      objectConfigurationsState[name] = generateConfigurationState(
        hydratedRevision.content.actions,
        PLACEHOLDER_VARS.OPERATION_TYPE,
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
  // adds optional fields that are selected (true)

  // convert set to object for config
  let selectedFields = Array.from(fields).reduce((acc, field) => ({
    ...acc,
    [field]: true,
  }), {});

  selectedFields = {
    ...selectedFields,
    ...(selectedOptionalFields || {}),
  };
  return selectedFields;
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

  const requiredField = requiredMapFields?.find(
    (field) => field.mapToName === objectName,
  );

  if (requiredField) {
    // Update the custome field value property to new value
    requiredField.value = value;
    const newState = {
      ...configureState,
      requiredMapFields: [...requiredMapFields || []],
    };

    return { isUpdated: true, newState };
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

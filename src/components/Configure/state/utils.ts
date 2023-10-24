import {
  Config, HydratedIntegrationAction,
  HydratedIntegrationFieldExistent,
  HydratedRevision,
} from '../../../services/api';
import {
  ConfigureState,
  ConfigureStateIntegrationField,
  CustomConfigureStateIntegrationField,
} from '../types';
import {
  getActionTypeFromActions, getFieldKeyValue, getOptionalFieldsFromObject,
  getRequiredMapFieldsFromObject,
  getRequiredFieldsFromObject, getStandardObjectFromAction,
  getValueFromConfigCustomMapping, getValueFromConfigExist,
  PLACEHOLDER_VARS,
} from '../utils';

export function getConfigurationState(
  actions: HydratedIntegrationAction[],
  type: string,
  objectName: string,
  config?: any,
): ConfigureState {
  const action = getActionTypeFromActions(actions, type);
  const object = action && getStandardObjectFromAction(action, objectName);

  const requiredFields = object && getRequiredFieldsFromObject(object);
  const optionalFields = object
    ? getOptionalFieldsFromObject(object)?.map((field) => ({
      ...field,
      value: getValueFromConfigExist(
        config,
        objectName,
        // should only use fieldName for existant fields
        getFieldKeyValue(field),
      ),
    })) as ConfigureStateIntegrationField[] : null; // type hack - TODO fix

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
    })) as CustomConfigureStateIntegrationField[] : null; // type hack - TODO fix

  const allFields = object?.allFields as HydratedIntegrationFieldExistent[] || [];

  return {
    allFields,
    requiredFields,
    optionalFields,
    requiredMapFields,
  };
}

export const resetConfigurationState = (
  hydratedRevision: HydratedRevision,
  config: Config | undefined,
  selectedObjectName: string,
  setConfigureState: React.Dispatch<React.SetStateAction<ConfigureState>>,
) => {
  const hydratedActions = hydratedRevision?.content.actions || []; // read / write / etc...
  const state = getConfigurationState(
    hydratedActions,
    PLACEHOLDER_VARS.OPERATION_TYPE,
    selectedObjectName,
    config,
  );
  setConfigureState(state);
};

/**
 * generates selectedFields object for Config from configureState
 * @param configureState
 * @returns
 */
export const generateSelectedFieldsFromConfigureState = (configureState: ConfigureState) => {
  const { requiredFields, optionalFields } = configureState;
  const fields = new Set<string>();
  requiredFields?.forEach((field) => fields.add(getFieldKeyValue(field)));
  // adds optional fields that are selected (true)
  optionalFields?.forEach((field) => field.value && fields.add(getFieldKeyValue(field)));
  // convert set to object for config
  const selectedFields = Array.from(fields).reduce((acc, field) => ({
    ...acc,
    [field]: true,
  }), {});
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

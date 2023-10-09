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
  getRequiredCustomMapFieldsFromObject,
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

  // todo map over requiredCustomMapFields and get value from config
  const requiredCustomMapFields = object ? getRequiredCustomMapFieldsFromObject(object)
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
    requiredCustomMapFields,
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

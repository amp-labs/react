import {
  Config,
  HydratedIntegrationAction,
  HydratedIntegrationField,
  HydratedIntegrationObject,
  IntegrationFieldMapping,
} from '../../services/api';

// TODO - add support for fetching these dynamically
const OPERATION_TYPE = 'read'; // only one supported for mvp
const providerWorkspaceRef = 'my-instance'; // get this from installation.connection
const OBJECT_NAME = 'account';
export const PLACEHOLDER_VARS = {
  OPERATION_TYPE,
  OBJECT_NAME,
  PROVIDER_WORKSPACE_REF: providerWorkspaceRef,
};

/**
 * type guard for IntegrationFieldMapping | IntegrationFieldExistent
 *
 * @param field HydratedIntegrationField
 * @returns
 */
export function isIntegrationFieldMapping(field: HydratedIntegrationField):
field is IntegrationFieldMapping {
  return (field as IntegrationFieldMapping).mapToName !== undefined;
}

// 1. get action type
/**
 *
 * @param actions HydratedIntegrationAction[]
 * @param type read / write / etc...
 * @returns HydratedIntegrationAction | null
 */
export function getActionTypeFromActions(actions: HydratedIntegrationAction[], type: string)
  : HydratedIntegrationAction | null {
  return actions.find((action) => action.type === type) || null;
}
// 2. get standard object
/**
 *
 * @param action HydratedIntegrationAction
 * @param objectName string (account, contect, etc...)
 * @returns HydratedIntegrationObject | null
 */
export function getStandardObjectFromAction(action: HydratedIntegrationAction, objectName: string)
  : HydratedIntegrationObject | null {
  return action?.standardObjects?.find((object) => object.objectName === objectName) || null;
}

// 3a. get required fields
export function getRequiredFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.requiredFields?.filter(
    (rf: HydratedIntegrationField) => !isIntegrationFieldMapping(rf) && !!rf.fieldName,
  ) || null;
}

// 3b. get required custom mapping fields
export function getRequiredCustomMapFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.requiredFields?.filter(
    (rf: HydratedIntegrationField) => isIntegrationFieldMapping(rf) && !!rf.mapToName,
  ) || null;
}

// 4. get optional fields
export function getOptionalFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.optionalFields || null;
}

const getReadObject = (
  config: Config,
  objectName:string,
) => config?.content?.read?.objects[objectName];

// 5. get value for field
export function getValueFromConfigExist(config: Config, objectName: string, key: string): boolean {
  const object = getReadObject(config, objectName);
  return object?.selectedFields?.[key] || false;
}

// 5b. get value for custom mapping field
export function getValueFromConfigCustomMapping(config: Config, objectName: string, key: string)
  : string {
  const object = getReadObject(config, objectName);
  return object?.selectedFieldMappings?.[key] || '';
}

// aux. get field value based on type guard
export function getFieldKeyValue(field: HydratedIntegrationField): string {
  if (isIntegrationFieldMapping(field)) {
    return field.mapToName; // custom mapping
  }
  return field.fieldName; // existant field
}

import {
  Config,
  HydratedIntegrationField,
  HydratedIntegrationObject,
  HydratedIntegrationRead,
  HydratedRevision,
  IntegrationFieldMapping,
} from '../../services/api';

import {
  NavObject,
} from './types';

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

// 1. get standard object
/**
 *
 * @param action HydratedIntegrationAction
 * @param objectName string (account, contect, etc...)
 * @returns HydratedIntegrationObject | null
 */
export function getStandardObjectFromAction(action: HydratedIntegrationRead, objectName: string)
  : HydratedIntegrationObject | null {
  return action?.standardObjects?.find((object) => object.objectName === objectName) || null;
}

// 2a. get required fields
export function getRequiredFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.requiredFields?.filter(
    (rf: HydratedIntegrationField) => !isIntegrationFieldMapping(rf) && !!rf.fieldName,
  ) || null;
}

// 2b. get required custom mapping fields
export function getRequiredMapFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.requiredFields?.filter(
    (rf: HydratedIntegrationField) => isIntegrationFieldMapping(rf) && !!rf.mapToName,
  ) || null;
}

// 3. get optional fields
export function getOptionalFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.optionalFields || null;
}

export const getReadObject = (
  config: Config,
  objectName: string,
) => config?.content?.read?.standardObjects?.[objectName];

// 4a. get value for field
export function getValueFromConfigExist(config: Config, objectName: string, key: string): boolean {
  const object = getReadObject(config, objectName);
  return object?.selectedFields?.[key] || false;
}

// 4b. get value for custom mapping field
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

// generates standard objects and whether they are complete based on config and hydrated revision
export function generateNavObjects(config: Config | undefined, hydratedRevision: HydratedRevision) {
  const navObjects: NavObject[] = [];
  hydratedRevision.content?.read?.standardObjects?.forEach((object) => {
    navObjects.push(
      {
        name: object?.objectName,
        // if no config, object is not completed
        // object is completed if the key exists in the config
        completed: config ? !!getReadObject(config, object.objectName) : false,
      },
    );
  });

  return navObjects;
}

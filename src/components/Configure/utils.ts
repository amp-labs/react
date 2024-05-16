import {
  ErrorBoundary,
} from '../../context/ErrorContextProvider';
import {
  Config,
  HydratedIntegrationField,
  HydratedIntegrationObject,
  HydratedIntegrationRead,
  HydratedRevision,
  IntegrationFieldMapping,
} from '../../services/api';

import { OTHER_CONST } from './nav/ObjectManagementNav/constant';
import {
  NavObject,
  SelectMappingFields,
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

// 1. get object
/**
 *
 * @param action HydratedIntegrationAction
 * @param objectName string (account, contact, etc...)
 * @returns HydratedIntegrationObject | null
 */
export function getObjectFromAction(action: HydratedIntegrationRead, objectName: string)
  : HydratedIntegrationObject | null {
  return action?.objects?.find((object) => object.objectName === objectName) || null;
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
  : IntegrationFieldMapping[] | null {
  const requiredMapFields = object?.requiredFields?.filter(
    (rf: HydratedIntegrationField) => isIntegrationFieldMapping(rf) && !!rf.mapToName,
  ) || [];
  return requiredMapFields as IntegrationFieldMapping[]; // type hack
}

// 3. get optional fields
export function getOptionalFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.optionalFields?.filter(
    (rf: HydratedIntegrationField) => !isIntegrationFieldMapping(rf) && !!rf.fieldName,
  ) || null;
}

export const getReadObject = (
  config: Config,
  objectName: string,
) => config?.content?.read?.objects?.[objectName];

// aux. get field value based on type guard
export function getFieldKeyValue(field: HydratedIntegrationField): string {
  if (isIntegrationFieldMapping(field)) {
    return field.mapToName; // custom mapping
  }
  return field.fieldName; // existent field
}

/**
 * generates Nav Objects for read action
 * @param config
 * @param hydratedRevision
 * @returns NavObject[]
 */
export const generateReadNavObjects = (config: Config | undefined, hydratedRevision: HydratedRevision) => {
  const navObjects: NavObject[] = [];
  hydratedRevision.content?.read?.objects?.forEach((object) => {
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
};

export const generateOtherNavObject = (
  config: Config | undefined,
) => {
  const navObject: NavObject = {
    name: OTHER_CONST,
    completed: config ? !!config?.content?.write : false,
  };
  return navObject;
};

// generates standard objects and whether they are complete based on config and hydrated revision
export function generateAllNavObjects(
  config: Config | undefined,
  hydratedRevision: HydratedRevision,
) {
  const navObjects: NavObject[] = generateReadNavObjects(config, hydratedRevision);
  const isWriteSupported = !!hydratedRevision?.content?.write;
  const otherNavObject = isWriteSupported ? generateOtherNavObject(config) : undefined;
  if (otherNavObject) { navObjects.push(otherNavObject); }
  return navObjects;
}

// validates whether required fields are filled out or throws error
export function validateFieldMappings(
  requiredMapFields: IntegrationFieldMapping[] | null | undefined,
  selectedRequiredMapFields: SelectMappingFields | null | undefined,
  setErrors: (boundary: ErrorBoundary, errors: string[]) => void,
) {
  // check if fields with requirements are met
  const fieldsWithRequirementsNotMet = requiredMapFields?.filter(
    (field) => !selectedRequiredMapFields?.[field?.mapToName],
  ) || [];

  const errorList = fieldsWithRequirementsNotMet.map((field) => field.mapToName);
  setErrors(ErrorBoundary.MAPPING, errorList);

  // if requires fields are not met, set error fields and return
  if (fieldsWithRequirementsNotMet?.length) {
    console.error('required fields not met', fieldsWithRequirementsNotMet.map((field) => field.mapToDisplayName));
  }
  return { errorList };
}

import { IntegrationFieldExistent } from "@generated/api/src";
import { ErrorBoundary } from "context/ErrorContextProvider";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import {
  Config,
  HydratedIntegrationField,
  HydratedIntegrationObject,
  HydratedIntegrationRead,
  HydratedRevision,
  IntegrationFieldMapping,
} from "services/api";
import { capitalize } from "src/utils";

import { WRITE_CONST } from "./nav/ObjectManagementNav/constant";
import { NavObject, SelectMappingFields } from "./types";
/**
 * type guard for IntegrationFieldMapping | IntegrationFieldExistent
 *
 * @param field HydratedIntegrationField
 * @returns
 */
export function isIntegrationFieldMapping(
  field: HydratedIntegrationField,
): field is IntegrationFieldMapping {
  return !(field as IntegrationFieldExistent).fieldName;
}

// 1. get object
/**
 *
 * @param action HydratedIntegrationAction
 * @param objectName string (account, contact, etc...)
 * @returns HydratedIntegrationObject | null
 */
export function getObjectFromAction(
  action: HydratedIntegrationRead,
  objectName: string,
): HydratedIntegrationObject | null {
  return (
    action?.objects?.find((object) => object.objectName === objectName) || null
  );
}

// 2a. get required fields
export function getRequiredFieldsFromObject(
  object: HydratedIntegrationObject,
): HydratedIntegrationField[] | null {
  return (
    object?.requiredFields?.filter(
      (rf: HydratedIntegrationField) =>
        !isIntegrationFieldMapping(rf) && !!rf.fieldName,
    ) || null
  );
}

// 2b. get required custom mapping fields
export function getRequiredMapFieldsFromObject(
  object: HydratedIntegrationObject,
): IntegrationFieldMapping[] | null {
  const requiredMapFields =
    object?.requiredFields?.filter(
      (rf: HydratedIntegrationField) =>
        isIntegrationFieldMapping(rf) && !!rf.mapToName,
    ) || [];
  return requiredMapFields as IntegrationFieldMapping[]; // type hack
}

// 2c. get optional custom mapping fields
export function getOptionalMapFieldsFromObject(
  object: HydratedIntegrationObject,
): IntegrationFieldMapping[] | null {
  const optionalMapFields =
    object?.optionalFields?.filter(
      (rf: HydratedIntegrationField) =>
        isIntegrationFieldMapping(rf) && !!rf.mapToName,
    ) || [];
  return optionalMapFields as IntegrationFieldMapping[]; // type hack
}

// 3. get optional fields
export function getOptionalFieldsFromObject(
  object: HydratedIntegrationObject,
): HydratedIntegrationField[] | null {
  return (
    object?.optionalFields?.filter(
      (rf: HydratedIntegrationField) =>
        !isIntegrationFieldMapping(rf) && !!rf.fieldName,
    ) || null
  );
}

export const getReadObject = (config: Config, objectName: string) =>
  config?.content?.read?.objects?.[objectName];

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
export const generateReadNavObjects = (
  config: Config | undefined,
  hydratedRevision: HydratedRevision,
) => {
  const navObjects: NavObject[] = [];
  hydratedRevision.content?.read?.objects?.forEach((object) => {
    navObjects.push({
      name: object?.objectName,
      displayName:
        object?.mapToDisplayName ||
        object?.displayName || // mapToDisplayName is preferred
        (object?.objectName && capitalize(object?.objectName)), // fallback to objectName
      // if no config, object is not completed
      // object is completed if the key exists in the config
      completed: config ? !!getReadObject(config, object.objectName) : false,
    });
  });

  return navObjects;
};

export const generateWriteNavObject = (config: Config | undefined) => {
  const navObject: NavObject = {
    name: WRITE_CONST,
    completed: config ? !!config?.content?.write : false,
  };
  return navObject;
};

// generates standard objects and whether they are complete based on config and hydrated revision
export function generateAllNavObjects(
  config: Config | undefined,
  hydratedRevision: HydratedRevision,
) {
  const navObjects: NavObject[] = generateReadNavObjects(
    config,
    hydratedRevision,
  );
  const isWriteSupported = !!hydratedRevision?.content?.write;
  const writeNavObject = isWriteSupported
    ? generateWriteNavObject(config)
    : undefined;
  if (writeNavObject) {
    navObjects.push(writeNavObject);
  }
  return navObjects;
}

// validates whether required fields are filled out or throws error
export function validateFieldMappings(
  requiredMapFields: IntegrationFieldMapping[] | null | undefined,
  selectedRequiredMapFields: SelectMappingFields | null | undefined,
  setErrors: (boundary: ErrorBoundary, errors: string[]) => void,
) {
  // check if fields with requirements are met
  const fieldsWithRequirementsNotMet =
    requiredMapFields?.filter(
      (field) => !selectedRequiredMapFields?.[field?.mapToName],
    ) || [];

  const errorList = fieldsWithRequirementsNotMet.map(
    (field) => field.mapToName,
  );
  setErrors(ErrorBoundary.MAPPING, errorList);

  // if requires fields are not met, set error fields and return
  if (fieldsWithRequirementsNotMet?.length) {
    console.error(
      "required fields not met",
      fieldsWithRequirementsNotMet.map((field) => field.mapToDisplayName),
    );
  }
  return { errorList };
}

/**
 * Helper function that checks if an object is effectively "empty" based on custom logic
 *
 * This handles these cases:
 * 1. null, undefined, or {} → considered empty
 * 2. Objects where all values are considered "empty" by custom logic
 *
 * Example: { field1: false, field2: undefined } → empty if false/undefined are "empty values"
 */
function isObjectEffectivelyEmpty(
  obj: Record<string, any> | null | undefined,
  isValueEmpty: (value: any) => boolean,
): boolean {
  // Handle null, undefined, or empty object {}
  if (isEmpty(obj)) return true;

  // Check if all values in the object are considered "empty"
  // Example: { field1: false, field2: false } where false = empty
  return Object.values(obj).every(isValueEmpty);
}

/**
 * Generic comparison function for server vs local data
 *
 * The pattern we use everywhere:
 * 1. If both server and local are "empty" → they're equal (no changes)
 * 2. If only one is empty → they're different (user made changes)
 * 3. If both have data → use deep comparison
 */
function isServerAndLocalDataEqual(
  serverData: Record<string, any> | undefined,
  localData: Record<string, any> | null | undefined,
  isValueEmpty: (value: any) => boolean,
): boolean {
  const serverIsEmpty = isObjectEffectivelyEmpty(serverData, isValueEmpty);
  const localIsEmpty = isObjectEffectivelyEmpty(localData, isValueEmpty);

  // Both empty = no changes made
  if (serverIsEmpty && localIsEmpty) {
    return true;
  }

  // One empty, one not = changes were made
  if (serverIsEmpty !== localIsEmpty) {
    return false;
  }

  // Both have data = compare them deeply
  return isEqual(serverData, localData);
}

/**
 * Compares optional fields from server vs local state
 *
 * Example usage:
 * - Server: undefined (no saved selections)
 * - Local: { field1: false, field2: false } (user didn't select anything)
 * - Result: true (both are effectively "empty")
 */
export function isOptionalFieldsEqual(
  serverOptionalFields: Record<string, boolean> | undefined,
  localOptionalFields: Record<string, boolean> | null | undefined,
): boolean {
  return isServerAndLocalDataEqual(
    serverOptionalFields,
    localOptionalFields,
    (value) => value === false || value === undefined, // false/undefined = not selected
  );
}

/**
 * Compares field mappings from server vs local state
 *
 * Example usage:
 * - Server: undefined (no saved mappings)
 * - Local: { field1: "", field2: "" } (user didn't map anything)
 * - Result: true (both are effectively "empty")
 */
export function isFieldMappingsEqual(
  serverFieldMappings: Record<string, string | undefined> | undefined,
  localFieldMappings: Record<string, string | undefined> | null | undefined,
): boolean {
  return isServerAndLocalDataEqual(
    serverFieldMappings,
    localFieldMappings,
    (value) => !value || value === "", // empty string/undefined = not mapped
  );
}

/**
 * Compares value mappings from server vs local state
 *
 * Example usage:
 * - Server: undefined (no saved value mappings)
 * - Local: { field1: {} } (user created field but no value mappings)
 * - Result: true (both are effectively "empty")
 */
export function isValueMappingsEqual(
  serverValueMappings: Record<string, Record<string, string>> | undefined,
  localValueMappings: Record<string, Record<string, string>> | null | undefined,
): boolean {
  return isServerAndLocalDataEqual(
    serverValueMappings,
    localValueMappings,
    (fieldMapping) => {
      // A field mapping is "empty" if it's not an object or has no keys
      if (!fieldMapping || typeof fieldMapping !== "object") return true;
      return Object.keys(fieldMapping).length === 0;
    },
  );
}

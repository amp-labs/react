import {
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationObject,
  IntegrationFieldMapping,
} from "@generated/api/src";

/**
 * Type guard for IntegrationFieldMapping.
 * A field is a mapping if it does not have a fieldName property.
 */
export function isIntegrationFieldMapping(
  field: HydratedIntegrationField,
): field is IntegrationFieldMapping {
  return !(field as HydratedIntegrationFieldExistent).fieldName;
}

/**
 * Returns the required fields from an object, filtering out mappings.
 *
 * @param object HydratedIntegrationObject
 * @returns HydratedIntegrationField[] | null
 */
export function getRequiredFieldsFromObject(
  object: HydratedIntegrationObject,
): HydratedIntegrationField[] | null {
  return (
    object?.requiredFields?.filter(
      (rf: HydratedIntegrationField) =>
        !isIntegrationFieldMapping(rf) &&
        !!(rf as HydratedIntegrationFieldExistent).fieldName,
    ) || null
  );
}

/**
 * Returns the optional fields from an object, filtering out mappings.
 *
 * @param object HydratedIntegrationObject
 * @returns HydratedIntegrationField[] | null
 */
export function getOptionalFieldsFromObject(
  object: HydratedIntegrationObject,
): HydratedIntegrationField[] | null {
  return (
    object?.optionalFields?.filter(
      (rf: HydratedIntegrationField) =>
        !isIntegrationFieldMapping(rf) &&
        !!(rf as HydratedIntegrationFieldExistent).fieldName,
    ) || null
  );
}

/**
 * Returns the required custom mapping fields from an object.
 *
 * @param object HydratedIntegrationObject
 * @returns IntegrationFieldMapping[] | null
 */
export function getRequiredMapFieldsFromObject(
  object: HydratedIntegrationObject,
): IntegrationFieldMapping[] | null {
  const requiredMapFields =
    object?.requiredFields?.filter(
      (rf: HydratedIntegrationField) =>
        isIntegrationFieldMapping(rf) && !!rf.mapToName,
    ) || [];
  return requiredMapFields as IntegrationFieldMapping[];
}

/**
 * Returns the optional custom mapping fields from an object.
 *
 * @param object HydratedIntegrationObject
 * @returns IntegrationFieldMapping[] | null
 */
export function getOptionalMapFieldsFromObject(
  object: HydratedIntegrationObject,
): IntegrationFieldMapping[] | null {
  const optionalMapFields =
    object?.optionalFields?.filter(
      (rf: HydratedIntegrationField) =>
        isIntegrationFieldMapping(rf) && !!rf.mapToName,
    ) || [];
  return optionalMapFields as IntegrationFieldMapping[];
}

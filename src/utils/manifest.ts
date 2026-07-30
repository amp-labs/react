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
 * Returns the label to show for a field in the read UI.
 *
 * Names the builder defined in amp.yaml (mapToDisplayName, then mapToName) take
 * precedence over the provider's own displayName, for two reasons:
 *
 * 1. A nested field has no provider metadata for its path, so the server falls
 *    back to TitleCase(fieldName) and the raw JSONPath leaks into the UI
 *    (e.g. "$['Customer']['Email']").
 * 2. Even when the provider's name is good, the end user is configuring what
 *    lands in the builder's product, so the builder's naming is what they
 *    recognize.
 *
 * @param field HydratedIntegrationField
 * @returns string
 */
export function getFieldDisplayName(field: HydratedIntegrationField): string {
  if (isIntegrationFieldMapping(field)) {
    return field.mapToDisplayName || field.mapToName;
  }

  return (
    field.mapToDisplayName ||
    field.mapToName ||
    field.displayName ||
    field.fieldName
  );
}

/**
 * Returns the required existent fields from an object (mappings excluded).
 * For required mapping fields use getRequiredMapFieldsFromObject.
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
 * Returns the optional existent fields from an object (mappings excluded).
 * For optional mapping fields use getOptionalMapFieldsFromObject.
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

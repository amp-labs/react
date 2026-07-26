import {
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationObject,
  IntegrationFieldMapping,
  ObjectMetadata,
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

/**
 * True when a read object is an "unresolved mapped object": declared in amp.yaml
 * with a mapToName but no concrete objectName. The integrating customer must
 * choose which provider-side object fulfills the mapping.
 */
export function isUnresolvedReadObject(
  object: HydratedIntegrationObject,
): boolean {
  return !object.objectName && !!object.mapToName;
}

/**
 * Produce a fully-formed HydratedIntegrationObject by combining an unresolved
 * manifest object with the user's chosen provider-side objectName and the
 * ObjectMetadata returned by getObjectMetadataForConnection.
 *
 * The amp.yaml can't declare required/existent fields on an unresolved object
 * (it doesn't know the provider-side fieldNames), so every field from the API
 * is surfaced as optional. Any IntegrationFieldMapping entries declared on the
 * original object are preserved.
 */
export function hydrateResolvedMappedObject(
  object: HydratedIntegrationObject,
  resolvedObjectName: string,
  metadata: ObjectMetadata | undefined,
): HydratedIntegrationObject {
  const existingRequired = object.requiredFields ?? [];
  const existingOptional = object.optionalFields ?? [];

  if (!metadata) {
    return { ...object, objectName: resolvedObjectName };
  }

  const existingOptionalFieldNames = new Set(
    existingOptional
      .filter((f) => !isIntegrationFieldMapping(f))
      .map((f) => (f as HydratedIntegrationFieldExistent).fieldName),
  );
  const existingRequiredFieldNames = new Set(
    existingRequired
      .filter((f) => !isIntegrationFieldMapping(f))
      .map((f) => (f as HydratedIntegrationFieldExistent).fieldName),
  );

  const extraOptional: HydratedIntegrationFieldExistent[] = Object.entries(
    metadata.fields ?? {},
  )
    .filter(
      ([fieldName]) =>
        !existingOptionalFieldNames.has(fieldName) &&
        !existingRequiredFieldNames.has(fieldName),
    )
    .map(([fieldName, meta]) => ({
      fieldName,
      displayName: meta.displayName || fieldName,
    }));

  return {
    ...object,
    objectName: resolvedObjectName,
    displayName:
      object.displayName || metadata.displayName || resolvedObjectName,
    optionalFields: [...existingOptional, ...extraOptional],
    allFieldsMetadata: {
      ...(object.allFieldsMetadata ?? {}),
      ...(metadata.fields ?? {}),
    },
  };
}

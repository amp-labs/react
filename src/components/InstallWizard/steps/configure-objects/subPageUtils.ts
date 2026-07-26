import type { HydratedIntegrationField } from "@generated/api/src";
import type { HydratedIntegrationFieldExistent } from "@generated/api/src";
import type { FieldMapping } from "src/components/Configure/InstallIntegration";
import type { Manifest } from "src/headless/types";

export type SubPage = "fields" | "mappings" | "additional";

/**
 * True when an object has any mappings to show on the Mappings sub-page:
 * manifest map fields, prop dynamic field mappings (a `mapToName` with no fixed
 * `fieldName`), or prop value mappings (`mappedValues`).
 */
export function hasObjectMappings(
  manifest: Manifest,
  objectName: string,
  fieldMapping?: FieldMapping,
): boolean {
  const obj = manifest.getReadObject(objectName);
  const manifestHasMappings =
    (obj?.getRequiredMapFields()?.length ?? 0) > 0 ||
    (obj?.getOptionalMapFields()?.length ?? 0) > 0;

  const propHasMappings = (fieldMapping?.[objectName] ?? []).some(
    (entry) =>
      (entry.mapToName && !entry.fieldName) ||
      (entry.mappedValues?.length ?? 0) > 0,
  );

  return manifestHasMappings || propHasMappings;
}

export function isExistentField(
  field: HydratedIntegrationField,
): field is HydratedIntegrationFieldExistent {
  return "fieldName" in field;
}

export function getFieldName(field: HydratedIntegrationField): string {
  return isExistentField(field) ? field.fieldName : "";
}

export function getFieldDisplayName(field: HydratedIntegrationField): string {
  if (isExistentField(field)) return field.displayName || field.fieldName;
  return "";
}

/**
 * Determine the initial sub-page for an object based on what data it has.
 */
export function getInitialSubPage(
  manifest: Manifest,
  objectName: string,
  fieldMapping?: FieldMapping,
): SubPage {
  const pages = getSubPages(manifest, objectName, fieldMapping);
  return pages[0];
}

/**
 * Determine the last sub-page for an object (used when navigating backward).
 */
export function getLastSubPage(
  manifest: Manifest,
  objectName: string,
  fieldMapping?: FieldMapping,
): SubPage {
  const pages = getSubPages(manifest, objectName, fieldMapping);
  return pages[pages.length - 1];
}

/**
 * Return the ordered list of sub-pages an object will visit.
 */
export function getSubPages(
  manifest: Manifest,
  objectName: string,
  fieldMapping?: FieldMapping,
): SubPage[] {
  const obj = manifest.getReadObject(objectName);
  if (!obj) return ["fields"];

  const pages: SubPage[] = [];

  const hasRequiredFields =
    (obj.getRequiredFields("no-mappings")?.length ?? 0) > 0;
  const hasObjectMapping = !!obj.object?.mapToName;
  if (hasRequiredFields || hasObjectMapping) pages.push("fields");

  if (hasObjectMappings(manifest, objectName, fieldMapping)) {
    pages.push("mappings");
  }

  const hasOptionalFields =
    (obj.getOptionalFields("no-mappings")?.length ?? 0) > 0;
  if (hasOptionalFields) pages.push("additional");

  return pages.length > 0 ? pages : ["fields"];
}

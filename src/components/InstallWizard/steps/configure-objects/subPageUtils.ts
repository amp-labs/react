import type { HydratedIntegrationField } from "@generated/api/src";
import type { HydratedIntegrationFieldExistent } from "@generated/api/src";
import type { Manifest } from "src/headless/types";

export type SubPage = "fields" | "mappings" | "additional";

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
): SubPage {
  const pages = getSubPages(manifest, objectName);
  return pages[0];
}

/**
 * Determine the last sub-page for an object (used when navigating backward).
 */
export function getLastSubPage(
  manifest: Manifest,
  objectName: string,
): SubPage {
  const pages = getSubPages(manifest, objectName);
  return pages[pages.length - 1];
}

/**
 * Return the ordered list of sub-pages an object will visit.
 */
export function getSubPages(manifest: Manifest, objectName: string): SubPage[] {
  const obj = manifest.getReadObject(objectName);
  if (!obj) return ["fields"];

  const pages: SubPage[] = [];

  const hasRequiredFields =
    (obj.getRequiredFields("no-mappings")?.length ?? 0) > 0;
  const hasObjectMapping = !!obj.object?.mapToName;
  if (hasRequiredFields || hasObjectMapping) pages.push("fields");

  const hasMappings =
    (obj.getRequiredMapFields()?.length ?? 0) > 0 ||
    (obj.getOptionalMapFields()?.length ?? 0) > 0;
  if (hasMappings) pages.push("mappings");

  // An object has optional fields to show on the "additional" page if it has
  // an explicit optionalFields list OR if it has auto-discovered customer
  // fields (e.g. from `optionalFieldsAuto: all` in amp.yaml). The latter
  // surface via manifest.getCustomerFieldsForObject(...).allFields.
  const hasExplicitOptionalFields =
    (obj.getOptionalFields("no-mappings")?.length ?? 0) > 0;
  const hasAutoOptionalFields =
    Object.keys(manifest.getCustomerFieldsForObject(objectName).allFields ?? {})
      .length > 0;
  if (hasExplicitOptionalFields || hasAutoOptionalFields) {
    pages.push("additional");
  }

  return pages.length > 0 ? pages : ["fields"];
}

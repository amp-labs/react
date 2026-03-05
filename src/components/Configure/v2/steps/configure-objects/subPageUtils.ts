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
  const obj = manifest.getReadObject(objectName);
  if (!obj) return "fields";

  const hasRequiredFields =
    (obj.getRequiredFields("no-mappings")?.length ?? 0) > 0;
  const hasObjectMapping = !!obj.object?.mapToName;

  if (hasRequiredFields || hasObjectMapping) return "fields";

  const hasMappings =
    (obj.getRequiredMapFields()?.length ?? 0) > 0 ||
    (obj.getOptionalMapFields()?.length ?? 0) > 0;

  if (hasMappings) return "mappings";

  return "additional";
}

/**
 * Determine the last sub-page for an object (used when navigating backward).
 */
export function getLastSubPage(
  manifest: Manifest,
  objectName: string,
): SubPage {
  const obj = manifest.getReadObject(objectName);
  if (!obj) return "fields";

  const hasOptionalFields =
    (obj.getOptionalFields("no-mappings")?.length ?? 0) > 0;
  if (hasOptionalFields) return "additional";

  const hasMappings =
    (obj.getRequiredMapFields()?.length ?? 0) > 0 ||
    (obj.getOptionalMapFields()?.length ?? 0) > 0;
  if (hasMappings) return "mappings";

  return "fields";
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

  const hasOptionalFields =
    (obj.getOptionalFields("no-mappings")?.length ?? 0) > 0;
  if (hasOptionalFields) pages.push("additional");

  return pages.length > 0 ? pages : ["fields"];
}

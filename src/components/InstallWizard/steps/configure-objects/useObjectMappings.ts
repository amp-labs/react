import { useMemo } from "react";
import type {
  DynamicMappingsInputMappedValue,
  IntegrationFieldMapping,
} from "@generated/api/src";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useManifest } from "src/headless";

/**
 * A value-mapping unit derived from the `fieldMapping` prop. Either:
 * - field-mapped: `mapToName` set, the resolved provider field comes from the
 *   user's field-mapping selection; or
 * - fixed-field: `fieldName` set, the provider field is pre-known and the user
 *   only maps its values.
 */
export interface ValueMappingUnit {
  /** Stable key for rendering (mapToName or fieldName). */
  key: string;
  /** Header label for the value block. */
  displayName: string;
  /** Present when the field must be picked by the user first. */
  mapToName?: string;
  /** Present when the provider field is fixed (no field-mapping step). */
  fieldName?: string;
  mappedValues: DynamicMappingsInputMappedValue[];
}

export interface ObjectMappings {
  /** Manifest-declared required field mappings (gate Next). */
  requiredMapFields: IntegrationFieldMapping[];
  /**
   * Optional field mappings = manifest optional map fields merged with prop
   * dynamic field mappings (entries with a `mapToName` and no fixed
   * `fieldName`). The prop wins on `mapToName` collisions.
   */
  optionalMapFields: IntegrationFieldMapping[];
  /** Value-mapping blocks derived from prop entries with `mappedValues`. */
  valueMappingUnits: ValueMappingUnit[];
}

const EMPTY: ObjectMappings = {
  requiredMapFields: [],
  optionalMapFields: [],
  valueMappingUnits: [],
};

/**
 * Merges amp.yaml manifest map fields with the developer-supplied `fieldMapping`
 * prop into the field rows and value blocks rendered on the Mappings sub-page.
 *
 * Mirrors the classic Configure variant, where dynamic field mappings come from
 * the prop (`OptionalFieldMappings`/`DynamicFieldMappings`) and value mappings
 * come from prop entries carrying `mappedValues` (`ValuesMapping`).
 */
export function useObjectMappings(
  objectName: string | undefined,
): ObjectMappings {
  const manifest = useManifest();
  const { fieldMapping } = useInstallIntegrationProps();

  return useMemo(() => {
    if (!objectName) return EMPTY;

    const obj = manifest.getReadObject(objectName);
    const requiredMapFields = obj?.getRequiredMapFields() ?? [];
    const manifestOptional = obj?.getOptionalMapFields() ?? [];

    const propEntries = fieldMapping?.[objectName] ?? [];

    // Prop dynamic field mappings: the user must pick a field for these
    // (they carry a mapToName and have no fixed fieldName).
    const dynamicFieldMappings = propEntries.filter(
      (entry) => entry.mapToName && !entry.fieldName,
    );

    // Prop takes precedence over manifest optional on mapToName collisions.
    const dynamicMapToNames = new Set(
      dynamicFieldMappings.map((entry) => entry.mapToName),
    );
    const dedupedManifestOptional = manifestOptional.filter(
      (field) => !dynamicMapToNames.has(field.mapToName),
    );

    const optionalMapFields: IntegrationFieldMapping[] = [
      ...dedupedManifestOptional,
      ...dynamicFieldMappings.map((entry) => ({
        mapToName: entry.mapToName as string,
        mapToDisplayName: entry.mapToDisplayName,
        prompt: entry.prompt,
      })),
    ];

    // Value mappings: any prop entry declaring mappedValues.
    const valueMappingUnits: ValueMappingUnit[] = propEntries
      .filter((entry) => (entry.mappedValues?.length ?? 0) > 0)
      .map((entry) => ({
        key: entry.mapToName ?? entry.fieldName ?? "",
        displayName:
          entry.mapToDisplayName ?? entry.mapToName ?? entry.fieldName ?? "",
        mapToName: entry.mapToName,
        fieldName: entry.fieldName,
        mappedValues: entry.mappedValues ?? [],
      }));

    return { requiredMapFields, optionalMapFields, valueMappingUnits };
  }, [manifest, fieldMapping, objectName]);
}

import { useMemo } from "react";
import { useManifest } from "src/headless";
import type { ReadObjectHandlers } from "src/headless/config/useConfigHelper";

import type { ValueMappingUnit } from "../useObjectMappings";

import { getAvailableOptions, validateValueMapping } from "./utils";
import { ValueMappingRow } from "./ValueMappingRow";

import styles from "./valueMappings.module.css";

interface ValueMappingBlockProps {
  objectName: string;
  unit: ValueMappingUnit;
  configHandlers: ReadObjectHandlers;
}

/**
 * Renders the value-mapping rows for a single prop entry. The provider field is
 * resolved from the user's field-mapping selection (for `mapToName` units) or
 * the entry's fixed `fieldName`. Renders nothing until a field is resolved or if
 * the field can't have its values mapped (mirrors classic validation).
 */
export function ValueMappingBlock({
  objectName,
  unit,
  configHandlers,
}: ValueMappingBlockProps) {
  const manifest = useManifest();

  const resolvedField = unit.mapToName
    ? configHandlers.getFieldMapping(unit.mapToName)
    : unit.fieldName;

  const fieldMetadata = useMemo(
    () =>
      resolvedField
        ? manifest
            .getCustomerFieldsForObject(objectName)
            .getField(resolvedField)
        : null,
    [manifest, objectName, resolvedField],
  );

  const hintBlock = (message: string) => (
    <div className={styles.valueMappingBlock}>
      <div className={styles.valueMappingBlockTitle}>
        Map the values for {unit.displayName}
      </div>
      <div className={styles.valueMappingHint}>{message}</div>
    </div>
  );

  // Field-mapped units have no field selected yet — prompt the user instead of
  // hiding the section, so it's clear values will need mapping once a field is
  // chosen.
  if (!resolvedField) {
    return hintBlock("Select a field above to map its values.");
  }

  const validation = validateValueMapping(
    resolvedField,
    unit.mappedValues.length,
    fieldMetadata ?? undefined,
  );
  if (!validation.isValid) {
    const isSelectType = ["singleSelect", "multiSelect"].includes(
      fieldMetadata?.valueType ?? "",
    );
    return hintBlock(
      isSelectType
        ? "The selected field's values can't be mapped to these options."
        : "Select a picklist (single/multi-select) field to map its values.",
    );
  }

  const allOptions = fieldMetadata?.values ?? [];
  const mappingsForField =
    configHandlers.object?.selectedValueMappings?.[resolvedField] ?? {};

  return (
    <div className={styles.valueMappingBlock}>
      <div className={styles.valueMappingBlockTitle}>
        Map the values for {unit.displayName}
      </div>
      {unit.mappedValues.map((mappedValue) => (
        <ValueMappingRow
          key={mappedValue.mappedValue}
          sourceDisplayValue={mappedValue.mappedDisplayValue}
          options={getAvailableOptions(
            allOptions,
            mappingsForField,
            mappedValue.mappedValue,
          )}
          selectedValue={mappingsForField[mappedValue.mappedValue]}
          onChange={(targetValue) =>
            configHandlers.setValueMapping({
              fieldName: resolvedField,
              sourceValue: mappedValue.mappedValue,
              targetValue,
            })
          }
        />
      ))}
    </div>
  );
}

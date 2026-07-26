import { useMemo } from "react";
import type { IntegrationFieldMapping } from "@generated/api/src";
import { ArrowRightIcon, WidthIcon } from "@radix-ui/react-icons";
import { ComboBox } from "src/components/ui-base/ComboBox/ComboBox";
import type { ReadObjectHandlers } from "src/headless/config/useConfigHelper";

import { InfoTooltip } from "../../../components/InfoTooltip";

import sharedStyles from "../configureObjectsStep.module.css";
import styles from "./mappingRow.module.css";

interface MappingRowProps {
  objectName: string;
  mapping: IntegrationFieldMapping;
  required: boolean;
  bidirectional?: boolean;
  customerFieldOptions: Array<{ fieldName: string; displayName: string }>;
  configHandlers: ReadObjectHandlers;
}

export function MappingRow({
  mapping,
  required,
  bidirectional,
  customerFieldOptions,
  configHandlers,
}: MappingRowProps) {
  const selectedValue = configHandlers.getFieldMapping(mapping.mapToName) ?? "";

  // Fields already mapped to a different destination — filtered out so the same
  // provider field can't be mapped twice within an object (mirrors classic
  // checkDuplicateFieldError, but prevents the duplicate rather than erroring).
  const selectedFieldMappings = configHandlers.object?.selectedFieldMappings;
  const usedByOtherMappings = useMemo(
    () =>
      new Set(
        Object.entries(selectedFieldMappings ?? {})
          .filter(([mapToName]) => mapToName !== mapping.mapToName)
          .map(([, fieldName]) => fieldName),
      ),
    [selectedFieldMappings, mapping.mapToName],
  );

  const items = useMemo(() => {
    const availableOptions = customerFieldOptions.filter(
      (f) =>
        f.fieldName === selectedValue || !usedByOtherMappings.has(f.fieldName),
    );
    const displayNameCounts = new Map<string, number>();
    availableOptions.forEach((f) => {
      displayNameCounts.set(
        f.displayName,
        (displayNameCounts.get(f.displayName) ?? 0) + 1,
      );
    });
    return availableOptions
      .map((f) => ({
        id: f.fieldName,
        label: f.displayName,
        value: f.fieldName,
        sublabel:
          (displayNameCounts.get(f.displayName) ?? 0) > 1
            ? f.fieldName
            : undefined,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [customerFieldOptions, usedByOtherMappings, selectedValue]);

  return (
    <div className={styles.mappingRow}>
      <div className={styles.mappingField}>
        <ComboBox
          items={items}
          selectedValue={selectedValue || null}
          onSelectedItemChange={(item) => {
            if (item?.value) {
              configHandlers.setFieldMapping({
                fieldName: item.value,
                mapToName: mapping.mapToName,
              });
            } else {
              configHandlers.deleteFieldMapping(mapping.mapToName);
            }
          }}
          placeholder="Select a field..."
          clearable={!required}
        />
      </div>
      <div className={styles.mappingArrow}>
        {bidirectional ? <WidthIcon /> : <ArrowRightIcon />}
      </div>
      <div className={styles.mappingField}>
        <div className={sharedStyles.mappingDisabledInput}>
          <span className={sharedStyles.mappingDisabledInputText}>
            {mapping.mapToDisplayName ?? mapping.mapToName}
            {required && <span className={styles.requiredAsterisk}>*</span>}
          </span>
          {mapping.prompt && <InfoTooltip text={mapping.prompt} />}
        </div>
      </div>
    </div>
  );
}

import type { IntegrationFieldMapping } from "@generated/api/src";
import {
  ArrowRightIcon,
  InfoCircledIcon,
  WidthIcon,
} from "@radix-ui/react-icons";
import type { ReadObjectHandlers } from "src/headless/config/useConfigHelper";

import sharedStyles from "./configureObjectsStep.module.css";
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
  objectName,
  mapping,
  required,
  bidirectional,
  customerFieldOptions,
  configHandlers,
}: MappingRowProps) {
  const selectedValue = configHandlers.getFieldMapping(mapping.mapToName) ?? "";

  return (
    <div className={styles.mappingRow}>
      <div className={styles.mappingField}>
        <select
          id={`mapping-${objectName}-${mapping.mapToName}`}
          className={styles.mappingSelect}
          value={selectedValue}
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              configHandlers.setFieldMapping({
                fieldName: value,
                mapToName: mapping.mapToName,
              });
            } else {
              configHandlers.deleteFieldMapping(mapping.mapToName);
            }
          }}
        >
          <option value="">Select a field...</option>
          {customerFieldOptions.map((field) => (
            <option key={field.fieldName} value={field.fieldName}>
              {field.displayName}
            </option>
          ))}
        </select>
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
          {mapping.prompt && (
            <span className={styles.mappingInfoTrigger}>
              <InfoCircledIcon />
              <span className={styles.mappingInfoTooltip}>
                {mapping.prompt}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

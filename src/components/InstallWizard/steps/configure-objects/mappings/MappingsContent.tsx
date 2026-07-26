import type { IntegrationFieldMapping } from "@generated/api/src";
import type { ReadObjectHandlers } from "src/headless/config/useConfigHelper";

import { SectionHeader } from "../../../components/SectionHeader";
import type { ValueMappingUnit } from "../useObjectMappings";
import { ValueMappingBlock } from "../value-mappings/ValueMappingBlock";

import { MappingRow } from "./MappingRow";

import valueMappingStyles from "../value-mappings/valueMappings.module.css";
import styles from "./mappingsContent.module.css";

interface MappingsContentProps {
  objectName: string;
  providerDisplayName: string;
  appName: string;
  isMappingBidirectional: boolean;
  requiredMapFields: IntegrationFieldMapping[];
  optionalMapFields: IntegrationFieldMapping[];
  valueMappingUnits: ValueMappingUnit[];
  customerFieldOptions: Array<{ fieldName: string; displayName: string }>;
  configHandlers: ReadObjectHandlers;
}

export function MappingsContent({
  objectName,
  providerDisplayName,
  appName,
  isMappingBidirectional,
  requiredMapFields,
  optionalMapFields,
  valueMappingUnits,
  customerFieldOptions,
  configHandlers,
}: MappingsContentProps) {
  const hasFieldMappings =
    requiredMapFields.length > 0 || optionalMapFields.length > 0;
  return (
    <>
      {hasFieldMappings && (
        <>
          <SectionHeader
            title="Field Mappings"
            description={`Map ${providerDisplayName} fields to the corresponding ${appName} fields for read${isMappingBidirectional ? " and write" : ""}.`}
          />
          <div className={styles.mappingContent}>
            <div className={styles.mappingColumnHeaders}>
              <span className={styles.mappingColumnTitle}>
                {providerDisplayName} Field
              </span>
              <span className={styles.mappingColumnArrow} />
              <span className={styles.mappingColumnTitle}>{appName} Field</span>
            </div>

            {requiredMapFields.map((mapping) => (
              <MappingRow
                key={mapping.mapToName}
                objectName={objectName}
                mapping={mapping}
                required
                bidirectional={isMappingBidirectional}
                customerFieldOptions={customerFieldOptions}
                configHandlers={configHandlers}
              />
            ))}
            {optionalMapFields.map((mapping) => (
              <MappingRow
                key={mapping.mapToName}
                objectName={objectName}
                mapping={mapping}
                required={false}
                bidirectional={isMappingBidirectional}
                customerFieldOptions={customerFieldOptions}
                configHandlers={configHandlers}
              />
            ))}
          </div>
        </>
      )}

      {valueMappingUnits.length > 0 && (
        <div className={valueMappingStyles.valueMappingSection}>
          <SectionHeader
            title="Value Mappings"
            description={`Map your values to the corresponding ${providerDisplayName} values.`}
          />
          {valueMappingUnits.map((unit) => (
            <ValueMappingBlock
              key={unit.key}
              objectName={objectName}
              unit={unit}
              configHandlers={configHandlers}
            />
          ))}
        </div>
      )}
    </>
  );
}

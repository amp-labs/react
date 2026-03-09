import type { IntegrationFieldMapping } from "@generated/api/src";
import type { ReadObjectHandlers } from "src/headless/config/useConfigHelper";

import { SectionHeader } from "../../../components/SectionHeader";

import { MappingRow } from "./MappingRow";

import styles from "./mappingsContent.module.css";

interface MappingsContentProps {
  objectName: string;
  providerDisplayName: string;
  appName: string;
  isMappingBidirectional: boolean;
  requiredMapFields: IntegrationFieldMapping[];
  optionalMapFields: IntegrationFieldMapping[];
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
  customerFieldOptions,
  configHandlers,
}: MappingsContentProps) {
  return (
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
          <span className={styles.mappingColumnTitle}>
            {appName} Field
          </span>
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
  );
}

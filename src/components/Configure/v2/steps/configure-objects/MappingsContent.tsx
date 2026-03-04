import type { IntegrationFieldMapping } from "@generated/api/src";
import type { ReadObjectHandlers } from "src/headless/config/useConfigHelper";

import { MappingRow } from "./MappingRow";

import sharedStyles from "./configureObjectsStep.module.css";

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
      <h3 className={sharedStyles.sectionTitle}>Field Mappings</h3>
      <p className={sharedStyles.helperText}>
        Map {providerDisplayName} fields to the corresponding {appName}{" "}
        fields for read
        {isMappingBidirectional ? " and write" : ""}.
      </p>
      <div className={sharedStyles.mappingContent}>
        <div className={sharedStyles.mappingColumnHeaders}>
          <span className={sharedStyles.mappingColumnTitle}>
            {providerDisplayName} Field
          </span>
          <span className={sharedStyles.mappingColumnArrow} />
          <span className={sharedStyles.mappingColumnTitle}>
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

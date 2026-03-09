import type { HydratedIntegrationField } from "@generated/api/src";
import { ArrowRightIcon, WidthIcon } from "@radix-ui/react-icons";

import { SectionHeader } from "../../../components/SectionHeader";
import { getFieldDisplayName, getFieldName } from "../subPageUtils";

import sharedStyles from "../configureObjectsStep.module.css";
import styles from "./fieldsContent.module.css";

interface FieldsContentProps {
  objectDisplayName: string;
  providerDisplayName: string;
  appName: string;
  hasObjectMapping: boolean;
  objectMapToDisplayName: string | undefined;
  isMappingBidirectional: boolean;
  hasRequiredFields: boolean;
  requiredFields: HydratedIntegrationField[];
  hasFieldsContent: boolean;
}

export function FieldsContent({
  objectDisplayName,
  providerDisplayName,
  appName,
  hasObjectMapping,
  objectMapToDisplayName,
  isMappingBidirectional,
  hasRequiredFields,
  requiredFields,
  hasFieldsContent,
}: FieldsContentProps) {
  return (
    <>
      {/* Object Mapping section */}
      {hasObjectMapping && (
        <div className={styles.fieldSection}>
          <SectionHeader
            title="Object Mapping"
            description={`This ${providerDisplayName} object is mapped to the corresponding ${appName} object.`}
          />
          <div className={styles.objectMappingInline}>
            <div className={sharedStyles.mappingDisabledInput}>
              <span className={sharedStyles.mappingDisabledInputText}>
                {objectDisplayName}
              </span>
            </div>
            <div className={styles.objectMappingArrow}>
              {isMappingBidirectional ? <WidthIcon /> : <ArrowRightIcon />}
            </div>
            <div className={sharedStyles.mappingDisabledInput}>
              <span className={sharedStyles.mappingDisabledInputText}>
                {objectMapToDisplayName}
              </span>
            </div>
          </div>
        </div>
      )}

      {hasRequiredFields && (
        <div className={styles.fieldSection}>
          <SectionHeader
            title="Included Fields"
            description="These fields are always read and require no configuration."
          />
          <div className={styles.fieldCardGrid}>
            {requiredFields.map((field) => {
              const fieldName = getFieldName(field);
              const displayName = getFieldDisplayName(field);
              return (
                <div
                  key={fieldName}
                  className={`${styles.fieldCard} ${styles.fieldCardDisabled}`}
                >
                  <span className={styles.fieldCardName}>{displayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hasFieldsContent && (
        <p className={styles.noFields}>
          No configurable fields for {objectDisplayName}.
        </p>
      )}
    </>
  );
}

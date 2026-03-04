import type { HydratedIntegrationField } from "@generated/api/src";
import { ArrowRightIcon, WidthIcon } from "@radix-ui/react-icons";

import { getFieldDisplayName, getFieldName } from "./subPageUtils";

import sharedStyles from "./configureObjectsStep.module.css";

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
        <div className={sharedStyles.fieldSection}>
          <h3 className={sharedStyles.sectionTitle}>Object Mapping</h3>
          <p className={sharedStyles.helperText}>
            This {providerDisplayName} object is mapped to the
            corresponding {appName} object.
          </p>
          <div className={sharedStyles.objectMappingInline}>
            <div className={sharedStyles.mappingDisabledInput}>
              <span className={sharedStyles.mappingDisabledInputText}>
                {objectDisplayName}
              </span>
            </div>
            <div className={sharedStyles.objectMappingArrow}>
              {isMappingBidirectional ? (
                <WidthIcon />
              ) : (
                <ArrowRightIcon />
              )}
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
        <div className={sharedStyles.fieldSection}>
          <h3 className={sharedStyles.sectionTitle}>Included Fields</h3>
          <p className={sharedStyles.helperText}>
            These fields are always read and require no configuration.
          </p>
          <div className={sharedStyles.fieldCardGrid}>
            {requiredFields.map((field) => {
              const fieldName = getFieldName(field);
              const displayName = getFieldDisplayName(field);
              return (
                <div
                  key={fieldName}
                  className={`${sharedStyles.fieldCard} ${sharedStyles.fieldCardDisabled}`}
                >
                  <span className={sharedStyles.fieldCardName}>
                    {displayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hasFieldsContent && (
        <p className={sharedStyles.noFields}>
          No configurable fields for {objectDisplayName}.
        </p>
      )}
    </>
  );
}

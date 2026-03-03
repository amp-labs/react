import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { HydratedIntegrationField } from "@generated/api/src";
import type { HydratedIntegrationFieldExistent } from "@generated/api/src";
import type { IntegrationFieldMapping } from "@generated/api/src";
import {
  ArrowRightIcon,
  InfoCircledIcon,
  WidthIcon,
} from "@radix-ui/react-icons";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useLocalConfig, useManifest } from "src/headless";
import type { ReadObjectHandlers } from "src/headless/config/useConfigHelper";
import { useProjectQuery } from "src/hooks/query/useProjectQuery";
import { useProvider } from "src/hooks/useProvider";

import type { CheckboxItem } from "components/ui-base/Checkbox/CheckboxPagination";
import { CheckboxPagination } from "components/ui-base/Checkbox/CheckboxPagination";

import { useWizard, WizardStep } from "../wizard/WizardContext";
import { WizardNavigation } from "../wizard/WizardNavigation";

import styles from "./ConfigureObjectsStep.module.css";

type SubPage = "fields" | "mappings" | "additional";

function MappingRow({
  objectName,
  mapping,
  required,
  bidirectional,
  customerFieldOptions,
  configHandlers,
}: {
  objectName: string;
  mapping: IntegrationFieldMapping;
  required: boolean;
  bidirectional?: boolean;
  customerFieldOptions: Array<{ fieldName: string; displayName: string }>;
  configHandlers: ReadObjectHandlers;
}) {
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
        <div className={styles.mappingDisabledInput}>
          <span className={styles.mappingDisabledInputText}>
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

function isExistentField(
  field: HydratedIntegrationField,
): field is HydratedIntegrationFieldExistent {
  return "fieldName" in field;
}

function getFieldName(field: HydratedIntegrationField): string {
  return isExistentField(field) ? field.fieldName : "";
}

function getFieldDisplayName(field: HydratedIntegrationField): string {
  if (isExistentField(field)) return field.displayName || field.fieldName;
  return "";
}

/**
 * Determine the initial sub-page for an object based on what data it has.
 */
function getInitialSubPage(
  manifest: ReturnType<typeof useManifest>,
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
function getLastSubPage(
  manifest: ReturnType<typeof useManifest>,
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
function getSubPages(
  manifest: ReturnType<typeof useManifest>,
  objectName: string,
): SubPage[] {
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

export function ConfigureObjectsStep() {
  const manifest = useManifest();
  const localConfig = useLocalConfig();
  const { provider } = useInstallIntegrationProps();
  const { providerName } = useProvider();
  const { appName: projectAppName } = useProjectQuery();
  const {
    state,
    isFirstObject,
    isLastObject,
    currentObjectName,
    nextObject,
    prevObject,
    nextStep,
    prevStep,
  } = useWizard();

  const { selectedObjects, currentObjectIndex } = state;

  // Local sub-page state
  const [subPage, setSubPage] = useState<SubPage>("fields");
  const pendingSubPageRef = useRef<SubPage | null>(null);
  const prevObjectNameRef = useRef(currentObjectName);

  // Reset sub-page only when the current object actually changes.
  // If a pending override exists (from backward navigation), use it instead.
  useEffect(() => {
    if (currentObjectName === prevObjectNameRef.current) return;
    prevObjectNameRef.current = currentObjectName;

    if (pendingSubPageRef.current !== null) {
      setSubPage(pendingSubPageRef.current);
      pendingSubPageRef.current = null;
    } else if (currentObjectName) {
      setSubPage(getInitialSubPage(manifest, currentObjectName));
    }

  }, [currentObjectName, manifest]);

  // Get manifest data for the current object
  const currentManifestObject = useMemo(() => {
    if (!currentObjectName) return null;
    return manifest.getReadObject(currentObjectName);
  }, [manifest, currentObjectName]);

  const requiredFields = useMemo(
    () => currentManifestObject?.getRequiredFields("no-mappings") ?? [],
    [currentManifestObject],
  );

  const optionalFields = useMemo(
    () => currentManifestObject?.getOptionalFields("no-mappings") ?? [],
    [currentManifestObject],
  );

  const requiredMapFields = useMemo(
    () => currentManifestObject?.getRequiredMapFields() ?? [],
    [currentManifestObject],
  );

  const optionalMapFields = useMemo(
    () => currentManifestObject?.getOptionalMapFields() ?? [],
    [currentManifestObject],
  );

  const customerFields = useMemo(() => {
    if (!currentObjectName) return {};
    return (
      manifest.getCustomerFieldsForObject(currentObjectName).allFields ?? {}
    );
  }, [manifest, currentObjectName]);

  // Derived booleans for current object
  const hasRequiredFields = requiredFields.length > 0;
  const hasOptionalFields = optionalFields.length > 0;
  const hasMappings =
    requiredMapFields.length > 0 || optionalMapFields.length > 0;

  // Object mapping data
  const objectMapToName = currentManifestObject?.object?.mapToName;
  const objectMapToDisplayName =
    currentManifestObject?.object?.mapToDisplayName || objectMapToName;
  const hasObjectMapping = !!objectMapToName;
  const hasFieldsContent = hasRequiredFields || hasObjectMapping;

  const isMappingBidirectional =
    !!currentObjectName &&
    !!localConfig.writeObject(currentObjectName).object;

  // Get config handlers for the current object
  const configHandlers = useMemo(() => {
    if (!currentObjectName) return null;
    return localConfig.readObject(currentObjectName);
  }, [localConfig, currentObjectName]);

  const customerFieldOptions = useMemo(
    () =>
      Object.entries(customerFields).map(([fieldName, meta]) => ({
        fieldName,
        displayName: meta.displayName || fieldName,
      })),
    [customerFields],
  );

  const handleToggleField = useCallback(
    (fieldName: string, selected: boolean) => {
      configHandlers?.setSelectedField({ fieldName, selected });
    },
    [configHandlers],
  );

  const optionalFieldItems: CheckboxItem[] = useMemo(
    () =>
      optionalFields.map((field) => ({
        id: getFieldName(field),
        label: getFieldDisplayName(field),
        isChecked:
          configHandlers?.getSelectedField(getFieldName(field)) ?? false,
      })),
    [optionalFields, configHandlers],
  );

  // Check if all required mappings have been filled
  const requiredMappingsComplete = useMemo(
    () =>
      requiredMapFields.every(
        (mapping) => !!configHandlers?.getFieldMapping(mapping.mapToName),
      ),
    [requiredMapFields, configHandlers],
  );

  // Sub-page-aware navigation
  const handleNext = useCallback(() => {
    if (subPage === "fields") {
      if (hasMappings) {
        setSubPage("mappings");
        return;
      }
      if (hasOptionalFields) {
        setSubPage("additional");
        return;
      }
    } else if (subPage === "mappings") {
      if (hasOptionalFields) {
        setSubPage("additional");
        return;
      }
    }
    // subPage === "additional" or no more sub-pages
    if (isLastObject) {
      nextStep();
    } else {
      nextObject();
    }
  }, [
    subPage,
    hasMappings,
    hasOptionalFields,
    isLastObject,
    nextStep,
    nextObject,
  ]);

  // Navigate backward through sub-pages and objects
  const handleBack = useCallback(() => {
    if (subPage === "additional") {
      if (hasMappings) {
        setSubPage("mappings");
        return;
      }
      if (hasFieldsContent) {
        setSubPage("fields");
        return;
      }
    } else if (subPage === "mappings") {
      if (hasFieldsContent) {
        setSubPage("fields");
        return;
      }
    }
    // subPage === "fields" or no previous sub-pages
    if (isFirstObject) {
      prevStep();
    } else {
      const prevIndex = currentObjectIndex - 1;
      const prevObjName = selectedObjects[prevIndex];
      if (prevObjName) {
        pendingSubPageRef.current = getLastSubPage(manifest, prevObjName);
      }
      prevObject();
    }
  }, [
    subPage,
    hasMappings,
    hasFieldsContent,
    isFirstObject,
    prevStep,
    currentObjectIndex,
    selectedObjects,
    manifest,
    prevObject,
  ]);

  // Progress bar calculation — track all sub-pages across all objects
  const currentObjectPages = useMemo(
    () => (currentObjectName ? getSubPages(manifest, currentObjectName) : []),
    [manifest, currentObjectName],
  );
  const currentPageIndex = currentObjectPages.indexOf(subPage);

  const { totalPages, completedPages } = useMemo(() => {
    let total = 0;
    let completed = 0;
    for (let i = 0; i < selectedObjects.length; i++) {
      const pages = getSubPages(manifest, selectedObjects[i]);
      total += pages.length;
      if (i < currentObjectIndex) {
        completed += pages.length;
      } else if (i === currentObjectIndex) {
        completed += Math.max(0, currentPageIndex);
      }
    }
    return { totalPages: total, completedPages: completed };
  }, [selectedObjects, manifest, currentObjectIndex, currentPageIndex]);

  if (!currentObjectName || !currentManifestObject) {
    return <div className={styles.empty}>No objects to configure.</div>;
  }

  const objectDisplayName =
    currentManifestObject.object?.displayName || currentObjectName;
  const appName = projectAppName || "Your App";
  const providerDisplayName = providerName || provider || "Provider";

  const progressPercent =
    totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;

  return (
    <div className={styles.configureObjects}>
      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBarText}>
          Configuring {objectDisplayName} ({currentPageIndex + 1} of{" "}
          {currentObjectPages.length}{" "}
          {currentObjectPages.length === 1 ? "page" : "pages"})
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className={styles.progressPercentage}>
          {progressPercent}% complete
        </div>
      </div>

      {/* Centered Card */}
      <div className={styles.objectConfigPanel}>
        <h2 className={styles.objectName}>{objectDisplayName}</h2>
        <p className={styles.objectDescription}>
          Confirm which {providerDisplayName} fields {appName} can read
          {isMappingBidirectional ? " and write" : ""}.
        </p>

        {/* Fields sub-page */}
        {subPage === "fields" && (
          <>
            {/* Object Mapping section */}
            {hasObjectMapping && (
              <div className={styles.fieldSection}>
                <h3 className={styles.sectionTitle}>Object Mapping</h3>
                <p className={styles.helperText}>
                  This {providerDisplayName} object is mapped to the
                  corresponding {appName} object.
                </p>
                <div className={styles.objectMappingInline}>
                  <div className={styles.mappingDisabledInput}>
                    <span className={styles.mappingDisabledInputText}>
                      {objectDisplayName}
                    </span>
                  </div>
                  <div className={styles.objectMappingArrow}>
                    {isMappingBidirectional ? (
                      <WidthIcon />
                    ) : (
                      <ArrowRightIcon />
                    )}
                  </div>
                  <div className={styles.mappingDisabledInput}>
                    <span className={styles.mappingDisabledInputText}>
                      {objectMapToDisplayName}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {hasRequiredFields && (
              <div className={styles.fieldSection}>
                <h3 className={styles.sectionTitle}>Included Fields</h3>
                <p className={styles.helperText}>
                  These fields are always read and require no configuration.
                </p>
                <div className={styles.fieldCardGrid}>
                  {requiredFields.map((field) => {
                    const fieldName = getFieldName(field);
                    const displayName = getFieldDisplayName(field);
                    return (
                      <div
                        key={fieldName}
                        className={`${styles.fieldCard} ${styles.fieldCardDisabled}`}
                      >
                        <span className={styles.fieldCardName}>
                          {displayName}
                        </span>
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
        )}

        {/* Mappings sub-page */}
        {subPage === "mappings" && configHandlers && (
          <>
            <h3 className={styles.sectionTitle}>Field Mappings</h3>
            <p className={styles.helperText}>
              Map {providerDisplayName} fields to the corresponding {appName}{" "}
              fields for read
              {isMappingBidirectional ? " and write" : ""}.
            </p>
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
                  objectName={currentObjectName}
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
                  objectName={currentObjectName}
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

        {/* Additional fields sub-page */}
        {subPage === "additional" && (
          <>
            <h3 className={styles.sectionTitle}>Additional Fields</h3>
            <p className={styles.helperText}>
              Would you like to share any optional {providerDisplayName} fields
              with {appName}?
            </p>
            <CheckboxPagination
              items={optionalFieldItems}
              onItemChange={handleToggleField}
            />
          </>
        )}
      </div>

      <WizardNavigation
        onBack={handleBack}
        onNext={handleNext}
        backLabel="Back"
        nextLabel="Next"
        nextDisabled={subPage === "mappings" && !requiredMappingsComplete}
      />
    </div>
  );
}

export function ConfigureObjectsGate() {
  const { state, goToStep } = useWizard();

  // If no objects selected, redirect back to select step
  if (state.selectedObjects.length === 0) {
    goToStep(WizardStep.SelectObjects);
    return null;
  }

  return <ConfigureObjectsStep />;
}

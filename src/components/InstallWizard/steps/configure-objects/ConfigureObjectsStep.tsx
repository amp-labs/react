import { useCallback, useEffect, useMemo } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useLocalConfig, useManifest } from "src/headless";
import { useProjectQuery } from "src/hooks/query/useProjectQuery";
import { useProvider } from "src/hooks/useProvider";
import { isUnresolvedReadObject } from "src/utils/manifest";

import type { CheckboxItem } from "components/ui-base/Checkbox/CheckboxPagination";

import { useResolvedMappedObjects } from "../../state/ResolvedMappedObjectsProvider";
import { useWizard, WizardStep } from "../../wizard/WizardContext";
import { WizardNavigation } from "../../wizard/WizardNavigation";

import { AdditionalFieldsContent } from "./additional/AdditionalFieldsContent";
import { FieldsContent } from "./fields/FieldsContent";
import { MappingsContent } from "./mappings/MappingsContent";
import { ObjectTabs } from "./ObjectTabs";
import { ResolveMappedObjectSubPage } from "./resolve/ResolveMappedObjectSubPage";
import { getFieldDisplayName, getFieldName } from "./subPageUtils";
import { useSubPageNavigation } from "./useSubPageNavigation";

import styles from "./configureObjectsStep.module.css";

export function ConfigureObjectsStep() {
  const manifest = useManifest();
  const localConfig = useLocalConfig();
  const { provider } = useInstallIntegrationProps();
  const { providerName } = useProvider();
  const { appName: projectAppName } = useProjectQuery();
  const { currentObjectName, replaceSelectedObject } = useWizard();
  const { clearResolution, getResolution, resolutions } =
    useResolvedMappedObjects();

  const {
    subPage,
    currentPageIndex,
    currentManifestObject,
    hasFieldsContent,
    handleNext,
    handleBack,
    handleTabClick,
  } = useSubPageNavigation();

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

  const hasRequiredFields = requiredFields.length > 0;

  // Object mapping data
  const objectMapToName = currentManifestObject?.object?.mapToName;
  const objectMapToDisplayName =
    currentManifestObject?.object?.mapToDisplayName || objectMapToName;
  const hasObjectMapping = !!objectMapToName;

  const isMappingBidirectional =
    !!currentObjectName && !!localConfig.writeObject(currentObjectName).object;

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

  if (!currentObjectName || !currentManifestObject) {
    return <div className={styles.empty}>No objects to configure.</div>;
  }

  const currentObject = currentManifestObject.object;
  if (currentObject && isUnresolvedReadObject(currentObject)) {
    return (
      <ResolveMappedObjectSubPage
        mapToName={currentObject.mapToName as string}
        mapToDisplayName={
          currentObject.mapToDisplayName ?? (currentObject.mapToName as string)
        }
      />
    );
  }

  const objectDisplayName =
    currentManifestObject.object?.displayName || currentObjectName;
  const appName = projectAppName || "Your App";
  const providerDisplayName = providerName || provider || "Provider";

  // If this object was previously an unresolved mapped object, show an Edit
  // affordance that lets the user change their selection.
  const currentMapToName = currentObject?.mapToName;
  const wasResolved =
    !!currentMapToName &&
    !!resolutions[currentMapToName] &&
    getResolution(currentMapToName)?.resolvedObjectName === currentObjectName;

  const handleEditResolution = () => {
    if (!currentMapToName) return;
    const resolvedName = currentObjectName;
    replaceSelectedObject(resolvedName, currentMapToName);
    localConfig.removeObject(resolvedName);
    clearResolution(currentMapToName);
  };

  return (
    <div className={styles.configureObjects}>
      <ObjectTabs
        currentPageIndex={currentPageIndex}
        onTabClick={handleTabClick}
      />

      {/* Centered Card */}
      <div className={styles.objectConfigPanel}>
        <h2 className={styles.objectName}>
          {objectDisplayName}
          {wasResolved && (
            <button
              type="button"
              className={styles.editResolution}
              onClick={handleEditResolution}
            >
              Edit
            </button>
          )}
        </h2>
        <p className={styles.objectDescription}>
          Confirm which {providerDisplayName} fields {appName} can read
          {isMappingBidirectional ? " and write" : ""}.
        </p>

        {subPage === "fields" && (
          <FieldsContent
            objectDisplayName={objectDisplayName}
            providerDisplayName={providerDisplayName}
            appName={appName}
            hasObjectMapping={hasObjectMapping}
            objectMapToDisplayName={objectMapToDisplayName}
            isMappingBidirectional={isMappingBidirectional}
            hasRequiredFields={hasRequiredFields}
            requiredFields={requiredFields}
            hasFieldsContent={hasFieldsContent}
          />
        )}

        {subPage === "mappings" && configHandlers && (
          <MappingsContent
            objectName={currentObjectName}
            providerDisplayName={providerDisplayName}
            appName={appName}
            isMappingBidirectional={isMappingBidirectional}
            requiredMapFields={requiredMapFields}
            optionalMapFields={optionalMapFields}
            customerFieldOptions={customerFieldOptions}
            configHandlers={configHandlers}
          />
        )}

        {subPage === "additional" && (
          <AdditionalFieldsContent
            providerDisplayName={providerDisplayName}
            appName={appName}
            optionalFieldItems={optionalFieldItems}
            onItemChange={handleToggleField}
          />
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
  useEffect(() => {
    if (state.selectedObjects.length === 0) {
      goToStep(WizardStep.SelectObjects);
    }
  }, [state.selectedObjects.length, goToStep]);

  if (state.selectedObjects.length === 0) {
    return null;
  }

  return <ConfigureObjectsStep />;
}

import { useCallback, useMemo, useState } from "react";
import { useLocalConfig } from "src/headless";
import { useManifest } from "src/headless";
import { useProjectQuery } from "src/hooks/query/useProjectQuery";
import { useProvider } from "src/hooks/useProvider";
import { isUnresolvedReadObject } from "src/utils/manifest";

import { InfoTooltip } from "../components/InfoTooltip";
import { StepHeader } from "../components/StepHeader";
import { useWizard } from "../wizard/WizardContext";
import { WizardNavigation } from "../wizard/WizardNavigation";

import styles from "./selectObjectsStep.module.css";

export function SelectObjectsStep() {
  const manifest = useManifest();
  const localConfig = useLocalConfig();
  const { state, setSelectedObjects, nextStep, prevStep } = useWizard();
  const { providerName } = useProvider();
  const { appName: projectAppName } = useProjectQuery();
  const appName = projectAppName || "Your App";

  // Track selected objects locally before committing
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(state.selectedObjects),
  );

  // Track which objects have write enabled locally
  const [writeEnabled, setWriteEnabled] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    state.selectedObjects.forEach((objectName) => {
      if (localConfig.writeObject(objectName).object) {
        initial.add(objectName);
      }
    });
    return initial;
  });

  // Get all available read objects from manifest
  const readObjects = manifest.getReadObjects();

  // Build a set of object names that have write support in the manifest.
  // Unresolved mapped objects have no objectName yet, so skip write detection.
  const writeSupported = useMemo(() => {
    const set = new Set<string>();
    readObjects.forEach((obj) => {
      if (!obj.objectName) return;
      const writeObj = manifest.getWriteObject(obj.objectName);
      if (writeObj?.object) set.add(obj.objectName);
    });
    return set;
  }, [readObjects, manifest]);

  // Stable identifier: real objectName if present, else mapToName.
  // Unresolved objects are keyed by mapToName until the user resolves them.
  const getStableKey = (obj: { objectName?: string; mapToName?: string }) =>
    obj.objectName || obj.mapToName || "";

  const toggleObject = useCallback((objectName: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(objectName)) {
        next.delete(objectName);
      } else {
        next.add(objectName);
      }
      return next;
    });
  }, []);

  const toggleWrite = useCallback((objectName: string) => {
    setWriteEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(objectName)) {
        next.delete(objectName);
      } else {
        next.add(objectName);
      }
      return next;
    });
  }, []);

  const handleNext = useCallback(() => {
    const selectedArray = Array.from(selected);
    const previouslySelected = new Set(state.selectedObjects);

    setSelectedObjects(selectedArray);

    const unresolvedKeys = new Set(
      readObjects
        .filter(isUnresolvedReadObject)
        .map((obj) => obj.mapToName as string),
    );

    // Initialize newly selected objects in the config draft. Skip unresolved
    // mapped objects — their draft entry is created once the user resolves them.
    selectedArray.forEach((objectName) => {
      if (unresolvedKeys.has(objectName)) return;
      localConfig.readObject(objectName).setEnableRead();
    });

    // Remove deselected objects from the config draft
    previouslySelected.forEach((objectName) => {
      if (!selected.has(objectName)) {
        localConfig.removeObject(objectName);
      }
    });

    // Apply write enable/disable for selected objects with write support
    selectedArray.forEach((objectName) => {
      if (writeSupported.has(objectName)) {
        const handlers = localConfig.writeObject(objectName);
        if (writeEnabled.has(objectName)) {
          handlers.setEnableWrite();
        } else {
          handlers.setDisableWrite();
        }
      }
    });

    nextStep();
  }, [
    selected,
    state.selectedObjects,
    setSelectedObjects,
    localConfig,
    writeSupported,
    writeEnabled,
    nextStep,
    readObjects,
  ]);

  const isValid = selected.size > 0;

  if (manifest.isLoading || manifest.isPending) {
    return <div className={styles.loading}>Loading available objects...</div>;
  }

  if (manifest.isError) {
    return (
      <div className={styles.error}>
        Error loading manifest. Please try again.
      </div>
    );
  }

  if (readObjects.length === 0) {
    return (
      <div className={styles.empty}>
        No objects available for this integration.
      </div>
    );
  }

  return (
    <div className={styles.selectObjects}>
      <StepHeader
        title="Select Objects"
        description={`Choose which objects you want to read from ${providerName}. You can configure each object later.`}
      />

      <div className={styles.objectList}>
        {readObjects.map((obj) => {
          const key = getStableKey(obj);
          const isUnresolved = isUnresolvedReadObject(obj);
          const isSelected = selected.has(key);
          const hasWrite = !isUnresolved && writeSupported.has(key);
          const isWriteOn = writeEnabled.has(key);
          const label =
            obj.displayName ||
            obj.mapToDisplayName ||
            obj.objectName ||
            obj.mapToName ||
            "";

          return (
            <div
              key={key}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              className={`${styles.objectCard} ${isSelected ? styles.selected : ""}`}
              onClick={(e) => {
                const isWriteToggle = (e.target as HTMLElement).closest(
                  `.${styles.writeToggle}`,
                );
                if (isWriteToggle) return;
                toggleObject(key);
              }}
              onKeyDown={(e) => {
                const isWriteToggle = (e.target as HTMLElement).closest(
                  `.${styles.writeToggle}`,
                );
                if (isWriteToggle) return;
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleObject(key);
                }
              }}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isSelected}
                tabIndex={-1}
                onChange={() => toggleObject(key)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className={styles.objectInfo}>
                <span className={styles.objectName}>{label}</span>
                {isUnresolved && (
                  <span className={styles.needsSetupBadge}>Needs setup</span>
                )}
              </div>
              {hasWrite && isSelected && (
                <label className={styles.writeToggle}>
                  <span className={styles.writeToggleLabel}>Write Enabled</span>
                  <InfoTooltip
                    text={`Allow ${appName} to write back to ${label}`}
                  />
                  <span className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      aria-label={`Enable write for ${label}`}
                      checked={isWriteOn}
                      onChange={() => toggleWrite(key)}
                    />
                    <span className={styles.toggleSlider} />
                  </span>
                </label>
              )}
            </div>
          );
        })}
      </div>

      <WizardNavigation
        onNext={handleNext}
        onBack={prevStep}
        nextDisabled={!isValid}
        nextLabel="Next"
      />
    </div>
  );
}

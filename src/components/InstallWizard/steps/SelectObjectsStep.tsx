import { useCallback, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import classNames from "classnames";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Button } from "src/components/ui-base/Button";
import { useLocalConfig } from "src/headless";
import { useManifest } from "src/headless";
import { useProjectQuery } from "src/hooks/query/useProjectQuery";
import { useAlwaysEnabledReadObjects } from "src/hooks/useAlwaysEnabledReadObjects";
import { useApplySubscribeEvents } from "src/hooks/useApplySubscribeEvents";
import { useInstallAlwaysEnabledObjects } from "src/hooks/useInstallAlwaysEnabledObjects";
import { useProvider } from "src/hooks/useProvider";

import { formatObjectList } from "../components/formatObjectList";
import { InfoTooltip } from "../components/InfoTooltip";
import { StepHeader } from "../components/StepHeader";
import { useWizard, WizardStep } from "../wizard/WizardContext";
import { WizardNavigation } from "../wizard/WizardNavigation";

import styles from "./selectObjectsStep.module.css";

const ALWAYS_ENABLED_TOOLTIP_ID = "always-enabled-object";

export function SelectObjectsStep() {
  const manifest = useManifest();
  const localConfig = useLocalConfig();
  const { state, setSelectedObjects, nextStep, prevStep, goToStep } =
    useWizard();
  const { providerName } = useProvider();
  const { subscribeEvents } = useInstallIntegrationProps();
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

  // The objects this installation subscribes to. The hydrated manifest carries no subscribe
  // block — `HydrateRevision` copies read, write and proxy only — so the caller's prop is the
  // only source for them, and it is also what decides the subscribe config that gets created.
  const subscribeObjectNames = useMemo(
    () => Object.keys(subscribeEvents ?? {}),
    [subscribeEvents],
  );

  // Objects marked `enabled: always` are read for every installation, so they are always
  // selected and can't be deselected. They still go through configuration like any other.
  const alwaysEnabledObjects = useAlwaysEnabledReadObjects();
  // They're installed as soon as the consumer connects, before this step can be used.
  const {
    isInstalling,
    error: installError,
    retry,
  } = useInstallAlwaysEnabledObjects();

  // Subscribe events the consumer is not asked about are settled here, before any of the
  // branches below return. Events with userSelect: true are left for the wizard to ask.
  useApplySubscribeEvents();

  const selectedOrAlwaysEnabled = useMemo(
    () => new Set([...selected, ...alwaysEnabledObjects]),
    [selected, alwaysEnabledObjects],
  );

  // Build a set of object names that have write support in the manifest
  const writeSupported = useMemo(() => {
    const set = new Set<string>();
    readObjects.forEach((obj) => {
      const writeObj = manifest.getWriteObject(obj.objectName);
      if (writeObj?.object) set.add(obj.objectName);
    });
    return set;
  }, [readObjects, manifest]);

  const toggleObject = useCallback(
    (objectName: string) => {
      if (alwaysEnabledObjects.has(objectName)) return;

      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(objectName)) {
          next.delete(objectName);
        } else {
          next.add(objectName);
        }
        return next;
      });
    },
    [alwaysEnabledObjects],
  );

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
    const selectedArray = Array.from(selectedOrAlwaysEnabled);
    const previouslySelected = new Set(state.selectedObjects);

    setSelectedObjects(selectedArray);

    // Initialize newly selected objects in the config draft
    selectedArray.forEach((objectName) => {
      localConfig.readObject(objectName).setEnableRead();
    });

    // Remove deselected objects from the config draft
    previouslySelected.forEach((objectName) => {
      if (!selectedOrAlwaysEnabled.has(objectName)) {
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

    // With no read objects there is nothing to configure, and ConfigureObjectsGate sends an
    // empty selection straight back here. Skip to review so the step is not a dead end.
    if (readObjects.length === 0) {
      goToStep(WizardStep.Review);

      return;
    }

    nextStep();
  }, [
    selectedOrAlwaysEnabled,
    state.selectedObjects,
    setSelectedObjects,
    localConfig,
    writeSupported,
    writeEnabled,
    nextStep,
    readObjects.length,
    goToStep,
  ]);

  // An integration can have no read objects at all — a subscribe-only integration carries
  // `read: objects: []` because the manifest requires a read block. There is then nothing to
  // select, which is not a reason to block the install.
  const hasNoReadObjects = readObjects.length === 0;
  const isValid = selectedOrAlwaysEnabled.size > 0 || hasNoReadObjects;

  if (manifest.isLoading || manifest.isPending) {
    return <div className={styles.loading}>Loading available objects...</div>;
  }

  if (isInstalling) {
    return <div className={styles.loading}>Setting up your integration...</div>;
  }

  if (installError) {
    return (
      <div className={styles.error}>
        We couldn&apos;t set up the objects this integration always reads:{" "}
        {installError}
        <Button type="button" onClick={retry}>
          Retry
        </Button>
      </div>
    );
  }

  if (manifest.isError) {
    return (
      <div className={styles.error}>
        Error loading manifest. Please try again.
      </div>
    );
  }

  if (hasNoReadObjects) {
    // Nothing is selectable, but the consumer should still see what they are installing.
    const isSyncing = subscribeObjectNames.length > 0;

    return (
      <div className={styles.selectObjects}>
        <StepHeader
          title="Select Objects"
          description={
            isSyncing
              ? `This integration will sync ${formatObjectList(subscribeObjectNames)} ${
                  subscribeObjectNames.length === 1 ? "object" : "objects"
                } from ${providerName}.`
              : `This integration does not read any objects from ${providerName}.`
          }
        />

        {isSyncing ? (
          <div className={styles.objectList}>
            {subscribeObjectNames.map((objectName) => (
              <div key={objectName} className={styles.syncedObjectCard}>
                <div className={styles.objectInfo}>
                  <span className={styles.objectName}>{objectName}</span>
                </div>
                <div className={styles.badges}>
                  <span className={styles.badge}>Subscribe</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            There is nothing to select. Continue to review and create the
            installation.
          </div>
        )}

        <WizardNavigation
          onNext={handleNext}
          onBack={prevStep}
          nextLabel="Next"
        />
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
          const isSelected = selectedOrAlwaysEnabled.has(obj.objectName);
          const isAlwaysEnabled = alwaysEnabledObjects.has(obj.objectName);
          const hasWrite = writeSupported.has(obj.objectName);
          const isWriteOn = writeEnabled.has(obj.objectName);

          return (
            <div
              key={obj.objectName}
              role="checkbox"
              aria-checked={isSelected}
              aria-disabled={isAlwaysEnabled}
              tabIndex={0}
              className={classNames(styles.objectCard, {
                [styles.selected]: isSelected,
                [styles.alwaysEnabled]: isAlwaysEnabled,
              })}
              onClick={(e) => {
                const isWriteToggle = (e.target as HTMLElement).closest(
                  `.${styles.writeToggle}`,
                );
                if (isWriteToggle) return;
                toggleObject(obj.objectName);
              }}
              onKeyDown={(e) => {
                const isWriteToggle = (e.target as HTMLElement).closest(
                  `.${styles.writeToggle}`,
                );
                if (isWriteToggle) return;
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleObject(obj.objectName);
                }
              }}
            >
              {/* The wrapper carries the tooltip: a disabled checkbox doesn't get hover events. */}
              <span
                className={styles.checkboxWrapper}
                data-tooltip-id={
                  isAlwaysEnabled ? ALWAYS_ENABLED_TOOLTIP_ID : undefined
                }
                data-tooltip-content={
                  isAlwaysEnabled ? "Always enabled" : undefined
                }
              >
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isSelected}
                  disabled={isAlwaysEnabled}
                  tabIndex={-1}
                  onChange={() => toggleObject(obj.objectName)}
                  onClick={(e) => e.stopPropagation()}
                />
              </span>
              <div className={styles.objectInfo}>
                <span className={styles.objectName}>
                  {obj.displayName || obj.objectName}
                </span>
              </div>
              {hasWrite && isSelected && (
                <label className={styles.writeToggle}>
                  <span className={styles.writeToggleLabel}>Write Enabled</span>
                  <InfoTooltip
                    text={`Allow ${appName} to write back to ${obj.displayName || obj.objectName}`}
                  />
                  <span className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      aria-label={`Enable write for ${obj.displayName || obj.objectName}`}
                      checked={isWriteOn}
                      onChange={() => toggleWrite(obj.objectName)}
                    />
                    <span className={styles.toggleSlider} />
                  </span>
                </label>
              )}
            </div>
          );
        })}
      </div>
      {alwaysEnabledObjects.size > 0 && (
        <Tooltip id={ALWAYS_ENABLED_TOOLTIP_ID} place="top" />
      )}

      <WizardNavigation
        onNext={handleNext}
        onBack={prevStep}
        nextDisabled={!isValid}
        nextLabel="Next"
      />
    </div>
  );
}

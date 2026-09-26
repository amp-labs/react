import { useCallback, useMemo } from "react";
import { WidthIcon } from "@radix-ui/react-icons";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Config } from "services/api";
import { Button } from "src/components/ui-base/Button";
import {
  useCreateInstallation,
  useInstallation,
  useLocalConfig,
  useManifest,
  useUpdateInstallation,
} from "src/headless";
import { handleServerError } from "src/utils/handleServerError";
import {
  getFieldDisplayName,
  isReadObjectAlwaysEnabled,
} from "src/utils/manifest";

import { StepHeader } from "../components/StepHeader";
import { useWizard } from "../wizard/WizardContext";

import styles from "./reviewStep.module.css";

export function ReviewStep() {
  const { state, prevStep, nextStep, setSubmissionError } = useWizard();
  const { selectedObjects } = state;
  const manifest = useManifest();
  const localConfig = useLocalConfig();
  const { installation } = useInstallation();
  const { createInstallation, isPending: isCreatePending } =
    useCreateInstallation();
  const { updateInstallation, isPending: isUpdatePending } =
    useUpdateInstallation();
  const isPending = isCreatePending || isUpdatePending;
  const { onInstallSuccess, onUpdateSuccess, setInstallation } =
    useInstallIntegrationProps();

  // `enabled: always` objects are installed as soon as the consumer connects, so when they're the
  // only objects selected, this step saves that installation rather than setting up new objects.
  const isOnlyAlwaysEnabled = useMemo(
    () =>
      selectedObjects.length > 0 &&
      selectedObjects.every((objectName) =>
        isReadObjectAlwaysEnabled(manifest.getReadObject(objectName).object),
      ),
    [selectedObjects, manifest],
  );

  // Build summary data for each selected object
  const objectSummaries = useMemo(() => {
    return selectedObjects.map((objectName) => {
      const manifestObj = manifest.getReadObject(objectName);
      const configObj = localConfig.readObject(objectName);

      // Required fields (always included)
      const requiredFields = (
        manifestObj?.getRequiredFields("no-mappings") ?? []
      )
        .filter((f) => "fieldName" in f)
        .map(getFieldDisplayName);

      // Selected optional fields
      const selectedOptionalFields = (
        manifestObj?.getOptionalFields("no-mappings") ?? []
      )
        .filter((f) => {
          const fieldName = "fieldName" in f ? f.fieldName : "";
          return fieldName && configObj?.getSelectedField(fieldName);
        })
        .map(getFieldDisplayName);

      // Configured field mappings (source → destination)
      const allMapFields = [
        ...(manifestObj?.getRequiredMapFields() ?? []),
        ...(manifestObj?.getOptionalMapFields() ?? []),
      ];
      const customerFields =
        manifest.getCustomerFieldsForObject(objectName).allFields ?? {};
      const configuredMappings = allMapFields
        .map((mapping) => {
          const sourceFieldName = configObj?.getFieldMapping(mapping.mapToName);
          if (!sourceFieldName) return null;
          const sourceLabel =
            customerFields[sourceFieldName]?.displayName || sourceFieldName;
          const destLabel = mapping.mapToDisplayName ?? mapping.mapToName;
          return { sourceLabel, destLabel, key: mapping.mapToName };
        })
        .filter(Boolean) as Array<{
        sourceLabel: string;
        destLabel: string;
        key: string;
      }>;

      // Object mapping info
      const objectMapTo =
        manifestObj?.object?.mapToDisplayName ||
        manifestObj?.object?.mapToName ||
        null;

      // Write status
      const writeObj = localConfig.writeObject(objectName);
      const writeEnabled = !!writeObj.object;
      const bidirectional = writeEnabled;

      return {
        objectName,
        displayName: manifestObj?.object?.displayName || objectName,
        requiredFields,
        selectedOptionalFields,
        configuredMappings,
        objectMapTo,
        writeEnabled,
        bidirectional,
      };
    });
  }, [selectedObjects, manifest, localConfig]);

  // An installation already exists when the integration has `enabled: always` objects: they're
  // installed as soon as the consumer connects, so this step updates it.
  const handleSubmit = useCallback(() => {
    setSubmissionError(null);

    const onError = (error: Error) => {
      handleServerError(error, setSubmissionError);
    };

    if (installation) {
      updateInstallation({
        config: localConfig.draft,
        onSuccess: (updated) => {
          setInstallation(updated);
          onUpdateSuccess?.(updated.id, updated.config as Config);
          nextStep();
        },
        onError,
      });

      return;
    }

    createInstallation({
      config: localConfig.draft,
      onSuccess: (created) => {
        setInstallation(created);
        onInstallSuccess?.(created.id, created.config as Config);
        nextStep();
      },
      onError,
    });
  }, [
    installation,
    updateInstallation,
    createInstallation,
    localConfig.draft,
    setSubmissionError,
    setInstallation,
    onInstallSuccess,
    onUpdateSuccess,
    nextStep,
  ]);

  return (
    <div className={styles.reviewStep}>
      <StepHeader
        title={isOnlyAlwaysEnabled ? "Review & Save" : "Review & Create"}
        description={
          isOnlyAlwaysEnabled
            ? "Review your configuration before saving the installation."
            : "Review your configuration before creating the installation."
        }
      />

      <div className={styles.summaryList}>
        {objectSummaries.map((summary) => (
          <div key={summary.objectName} className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <span className={styles.objectName}>{summary.displayName}</span>
              <span className={styles.objectDescription}>
                Reads{summary.writeEnabled ? " and writes" : ""}
                {summary.objectMapTo ? ` to ${summary.objectMapTo}` : ""}
              </span>
            </div>
            <div className={styles.cardDetails}>
              {summary.requiredFields.map((name) => (
                <span key={name} className={styles.pill}>
                  {name}
                </span>
              ))}
              {summary.selectedOptionalFields.map((name) => (
                <span key={name} className={styles.pill}>
                  {name}
                </span>
              ))}
            </div>
            {summary.configuredMappings.length > 0 && (
              <div className={styles.cardMappings}>
                {summary.configuredMappings.map((m) => (
                  <span key={m.key} className={styles.mappingPill}>
                    {m.sourceLabel} <WidthIcon /> {m.destLabel}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {state.submissionError && (
        <div className={styles.error}>{state.submissionError}</div>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={prevStep}>
          Back
        </Button>
        <Button
          type="button"
          className={styles.createButton}
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isOnlyAlwaysEnabled
            ? isPending
              ? "Saving..."
              : "Save Installation"
            : isPending
              ? "Creating..."
              : "Create Installation"}
        </Button>
      </div>
    </div>
  );
}

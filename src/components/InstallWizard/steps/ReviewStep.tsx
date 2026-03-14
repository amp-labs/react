import { useCallback, useMemo } from "react";
import { WidthIcon } from "@radix-ui/react-icons";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Config } from "services/api";
import { Button } from "src/components/ui-base/Button";
import {
  useCreateInstallation,
  useLocalConfig,
  useManifest,
} from "src/headless";

import { StepHeader } from "../components/StepHeader";
import { useWizard } from "../wizard/WizardContext";

import styles from "./ReviewStep.module.css";

export function ReviewStep() {
  const { state, prevStep, nextStep, setSubmitting, setSubmissionError } =
    useWizard();
  const { selectedObjects } = state;
  const manifest = useManifest();
  const localConfig = useLocalConfig();
  const { createInstallation, isPending } = useCreateInstallation();
  const { onInstallSuccess, setInstallation } = useInstallIntegrationProps();

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
        .map((f) => ("fieldName" in f ? f.displayName || f.fieldName : ""));

      // Selected optional fields
      const selectedOptionalFields = (
        manifestObj?.getOptionalFields("no-mappings") ?? []
      )
        .filter((f) => {
          const fieldName = "fieldName" in f ? f.fieldName : "";
          return fieldName && configObj?.getSelectedField(fieldName);
        })
        .map((f) => ("fieldName" in f ? f.displayName || f.fieldName : ""));

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

  const handleCreate = useCallback(() => {
    setSubmitting(true);
    setSubmissionError(null);

    createInstallation({
      config: localConfig.draft,
      onSuccess: (installation) => {
        setSubmitting(false);
        setInstallation(installation);
        onInstallSuccess?.(installation.id, installation.config as Config);
        nextStep();
      },
      onError: (error) => {
        setSubmitting(false);
        setSubmissionError(error.message);
      },
    });
  }, [
    createInstallation,
    localConfig.draft,
    setSubmitting,
    setSubmissionError,
    setInstallation,
    onInstallSuccess,
    nextStep,
  ]);

  return (
    <div className={styles.reviewStep}>
      <StepHeader
        title="Review & Create"
        description="Review your configuration before creating the installation."
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
          onClick={handleCreate}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Installation"}
        </Button>
      </div>
    </div>
  );
}

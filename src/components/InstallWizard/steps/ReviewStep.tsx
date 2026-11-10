import { useCallback, useMemo } from "react";
import type { SubscribeConfigObject } from "@generated/api/src";
import {
  ConfigCreateEventEnabledEnum,
  ConfigDeleteEventEnabledEnum,
  ConfigUpdateEventEnabledEnum,
} from "@generated/api/src";
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
import { useAlwaysEnabledReadObjects } from "src/hooks/useAlwaysEnabledReadObjects";
import { handleServerError } from "src/utils/handleServerError";
import { getFieldDisplayName } from "src/utils/manifest";

import { formatObjectList } from "../components/formatObjectList";
import { StepHeader } from "../components/StepHeader";
import { useWizard } from "../wizard/WizardContext";

import styles from "./reviewStep.module.css";

const CREATE_COPY = {
  title: "Review & Create",
  description: "Review your configuration before creating the installation.",
  submit: "Create Installation",
  pending: "Creating...",
};

const SAVE_COPY = {
  title: "Review & Save",
  description: "Review your configuration before saving the installation.",
  submit: "Save Installation",
  pending: "Saving...",
};

// The create, update and delete events the object is subscribed to, as "create", "update"
// and "delete".
function subscribedEvents(object: SubscribeConfigObject): string[] {
  return [
    object.createEvent?.enabled === ConfigCreateEventEnabledEnum.Always &&
      "create",
    object.updateEvent?.enabled === ConfigUpdateEventEnabledEnum.Always &&
      "update",
    object.deleteEvent?.enabled === ConfigDeleteEventEnabledEnum.Always &&
      "delete",
  ].filter((event): event is string => !!event);
}

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

  // The subscribe objects Review submits, listed when the install has no read objects so
  // Review is not empty. Select Objects writes them to the draft from the subscribeEvents
  // prop. Hidden next to read objects because an inheriting object delivers its read config's
  // fields, not the watch fields shown here; with no read objects every object is
  // non-inheriting, since the server rejects an inheriting one without a matching read object.
  const subscribeObjects = useMemo(
    () =>
      selectedObjects.length > 0
        ? []
        : Object.values(localConfig.draft.subscribe?.objects ?? {}),
    [selectedObjects.length, localConfig.draft.subscribe?.objects],
  );

  // `enabled: always` objects are installed as soon as the consumer connects, so when they're the
  // only objects selected, this step saves that installation rather than setting up new objects.
  const alwaysEnabledObjects = useAlwaysEnabledReadObjects();
  const isOnlyAlwaysEnabled =
    selectedObjects.length > 0 &&
    selectedObjects.every((objectName) => alwaysEnabledObjects.has(objectName));
  const copy = isOnlyAlwaysEnabled ? SAVE_COPY : CREATE_COPY;

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
      <StepHeader title={copy.title} description={copy.description} />

      {objectSummaries.length === 0 && subscribeObjects.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>There is nothing to configure.</p>
        </div>
      )}

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

        {subscribeObjects.map((object) => {
          const events = subscribedEvents(object);
          const watchFields = object.updateEvent?.requiredWatchFields ?? [];

          return (
            <div
              key={`subscribe-${object.objectName}`}
              className={styles.summaryCard}
            >
              <div className={styles.cardHeader}>
                <span className={styles.objectName}>{object.objectName}</span>
                <span className={styles.objectDescription}>
                  {events.length > 0
                    ? `Subscribes to ${formatObjectList(events)} events`
                    : "Subscribes to events"}
                </span>
              </div>
              {watchFields.length > 0 && (
                <div className={styles.cardDetails}>
                  {watchFields.map((name) => (
                    <span key={name} className={styles.pill}>
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
          {isPending ? copy.pending : copy.submit}
        </Button>
      </div>
    </div>
  );
}

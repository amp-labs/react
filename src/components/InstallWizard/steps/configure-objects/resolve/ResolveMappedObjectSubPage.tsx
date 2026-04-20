import { FormEvent, useEffect, useState } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useResolvedMappedObjects } from "src/components/InstallWizard/state/ResolvedMappedObjectsProvider";
import { Button } from "src/components/ui-base/Button";
import { useLocalConfig } from "src/headless";
import { useObjectMetadataForConnectionQuery } from "src/hooks/query/useObjectMetadataForConnectionQuery";

import { FormControl } from "../../../../form/FormControl";
import { Input } from "../../../../form/Input";
import { useWizard } from "../../../wizard/WizardContext";

import styles from "./resolveMappedObjectSubPage.module.css";

interface ResolveMappedObjectSubPageProps {
  mapToName: string;
  mapToDisplayName: string;
  initialValue?: string;
}

export function ResolveMappedObjectSubPage({
  mapToName,
  mapToDisplayName,
  initialValue,
}: ResolveMappedObjectSubPageProps) {
  const { provider, groupRef } = useInstallIntegrationProps();
  const { setResolution } = useResolvedMappedObjects();
  const { replaceSelectedObject } = useWizard();
  const localConfig = useLocalConfig();

  const [draftName, setDraftName] = useState(initialValue ?? "");
  const [submittedName, setSubmittedName] = useState<string | undefined>(
    undefined,
  );

  const { data, error, isFetching, isSuccess, refetch } =
    useObjectMetadataForConnectionQuery({
      provider,
      providerObjectName: submittedName ?? "",
      groupRef,
      enabled: !!submittedName,
    });

  useEffect(() => {
    if (!isSuccess || !data || !submittedName) return;

    setResolution(mapToName, {
      resolvedObjectName: submittedName,
      metadata: data,
    });

    // Swap the current wizard selection entry from mapToName → resolvedObjectName
    // so every downstream consumer (draft, tabs, review) keys off a real objectName.
    if (mapToName !== submittedName) {
      replaceSelectedObject(mapToName, submittedName);
      localConfig.removeObject(mapToName);
    }

    // Initialize the draft under the resolved objectName so subsequent sub-pages
    // see a valid handlers entry.
    localConfig.readObject(submittedName).setEnableRead();
  }, [
    isSuccess,
    data,
    submittedName,
    mapToName,
    setResolution,
    replaceSelectedObject,
    localConfig,
  ]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = draftName.trim();
    if (!trimmed) return;
    if (trimmed === submittedName) {
      refetch();
      return;
    }
    setSubmittedName(trimmed);
  };

  const inputId = `resolve-mapped-object-${mapToName}`;
  const errorMessage = error instanceof Error ? error.message : undefined;
  const isInvalid = !!error;

  return (
    <form className={styles.container} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <h2 className={styles.title}>Set up {mapToDisplayName}</h2>
        <p className={styles.description}>
          Which object in your provider represents{" "}
          <strong>{mapToDisplayName}</strong>? Enter the object&apos;s API name.
        </p>
      </div>

      <FormControl
        id={inputId}
        label="Object name"
        isRequired
        isInvalid={isInvalid}
        errorMessage={
          errorMessage ??
          "We couldn't load metadata for that object. Check the name and try again."
        }
      >
        <Input
          id={inputId}
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="e.g. contacts"
          isError={isInvalid}
          disabled={isFetching}
        />
      </FormControl>

      <div className={styles.actions}>
        <Button type="submit" disabled={!draftName.trim() || isFetching}>
          {isFetching ? "Loading…" : "Continue"}
        </Button>
      </div>
    </form>
  );
}

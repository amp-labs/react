import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Config, Installation } from "services/api";
import {
  useConnection,
  useCreateInstallation,
  useInstallation,
  useManifest,
  useUpdateInstallation,
} from "src/headless";

import { useAlwaysEnabledReadObjects } from "./useAlwaysEnabledReadObjects";

/**
 * Installs the read objects marked `enabled: always` as soon as one is missing: it creates the
 * installation once a connection exists, or updates an existing installation that lacks one.
 * Consumers can't opt out of these objects, so screens that let the consumer configure the
 * installation wait for this and then only ever update it.
 *
 * @returns `isInstalling` while objects are being saved, and `error` with `retry` if saving failed.
 */
export function useInstallAlwaysEnabledObjects() {
  const { connection } = useConnection();
  const { installation, isPending: isInstallationPending } = useInstallation();
  const { data: hydratedRevision } = useManifest();
  const alwaysEnabledObjects = useAlwaysEnabledReadObjects();
  const { createInstallation } = useCreateInstallation();
  const { updateInstallation } = useUpdateInstallation();
  const { setInstallation, onInstallSuccess, onUpdateSuccess } =
    useInstallIntegrationProps();
  const [error, setError] = useState<string | null>(null);
  const attempted = useRef<string | null>(null);

  const missingObjects = useMemo(() => {
    // Compare names case-insensitively, as the server does, so an installation created through
    // the API with `Account` isn't given a second `account` entry.
    const configured = new Set(
      Object.entries(
        installation?.config?.content?.read?.objects ?? {},
      ).flatMap(([key, obj]) => [
        key.toLowerCase(),
        obj.objectName?.toLowerCase(),
      ]),
    );

    return [...alwaysEnabledObjects].filter(
      (objectName) => !configured.has(objectName.toLowerCase()),
    );
  }, [alwaysEnabledObjects, installation]);

  const save = useCallback(() => {
    // The same entry the server writes for these objects: no fields chosen, so only the fields
    // amp.yaml requires are read until the consumer picks optional ones.
    const objects = Object.fromEntries(
      missingObjects.map((objectName) => [
        objectName,
        { objectName, selectedFields: {}, selectedFieldMappings: {} },
      ]),
    );
    const onError = (err: Error) => setError(err.message);
    const onSuccess =
      (callback?: (installationId: string, config: Config) => void) =>
      (saved: Installation) => {
        setInstallation(saved);
        callback?.(saved.id, saved.config as Config);
      };

    setError(null);

    if (installation) {
      updateInstallation({
        config: { read: { objects } },
        onSuccess: onSuccess(onUpdateSuccess),
        onError,
      });
    } else {
      createInstallation({
        config: { read: { objects } },
        onSuccess: onSuccess(onInstallSuccess),
        onError,
      });
    }
  }, [
    missingObjects,
    installation,
    updateInstallation,
    createInstallation,
    setInstallation,
    onInstallSuccess,
    onUpdateSuccess,
  ]);

  // One attempt per installation and set of missing objects. A failure waits for retry.
  const isReady = !!connection && !isInstallationPending && !!hydratedRevision;
  const attemptKey =
    isReady && missingObjects.length > 0
      ? `${installation?.id ?? "new"}:${missingObjects.join(",")}`
      : null;

  useEffect(() => {
    if (!attemptKey || attempted.current === attemptKey) return;
    attempted.current = attemptKey;
    save();
  }, [attemptKey, save]);

  // A failure only matters while objects are still missing: if another tab or request installed
  // them in the meantime, there's nothing left to retry.
  const currentError = attemptKey ? error : null;

  return {
    isInstalling: !!attemptKey && !currentError,
    error: currentError,
    retry: save,
  };
}

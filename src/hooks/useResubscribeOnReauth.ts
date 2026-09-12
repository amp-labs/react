import { useCallback } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useProjectQuery } from "src/hooks/query";

import { useResubscribeInstallationMutation } from "./mutation/useResubscribeInstallationMutation";

/**
 * Returns a function to call once a reauthentication has persisted new credentials, which restarts
 * subscribe setup for the installation.
 *
 * Reconnecting is opt-in: it does nothing unless the builder passed `resubscribeOnReAuth` to
 * `InstallIntegration`. It also does nothing without an installation in context, since the
 * update-connection UI can render inside `ConnectProvider`, where there is no installation to
 * reconnect.
 *
 * The call is deliberately fire-and-forget and invisible to the consumer. The credential update has
 * already succeeded by this point, so a failure here must not be surfaced as a failed
 * reauthentication; builders see failures through the operations API and the subscribe error
 * notification instead.
 */
export function useResubscribeOnReauth() {
  const { resubscribeOnReAuth, integrationId, installation } =
    useInstallIntegrationProps();
  const { projectIdOrName } = useProjectQuery();
  const { mutate } = useResubscribeInstallationMutation();

  const installationId = installation?.id;

  return useCallback(() => {
    if (!resubscribeOnReAuth) return;
    if (!projectIdOrName || !integrationId || !installationId) return;

    mutate(
      { projectIdOrName, integrationId, installationId },
      {
        onError: (error) => {
          console.error("Failed to start subscription reconnect", error);
        },
      },
    );
  }, [
    resubscribeOnReAuth,
    projectIdOrName,
    integrationId,
    installationId,
    mutate,
  ]);
}

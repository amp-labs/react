import { useProject } from "src/context/ProjectContextProvider";
import { useDeleteInstallationMutation } from "src/hooks/mutation/useDeleteInstallationMutation";
import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";

import { useInstallationProps } from "../InstallationProvider";

import { useInstallation } from "./useInstallation";

/**
 * delete installation hook
 * @returns {Object} An object containing:
 *   - `deleteInstallation` (function): A function to delete the installation.
 *   - `isIdle` (boolean): Whether the mutation is idle.
 *   - `isPending` (boolean): Whether the mutation is pending.
 *   - `error` (Error | null): The error object, if any.
 *   - `errorMsg` (string | null): The error message, if any.
 */
export function useDeleteInstallation() {
  const { projectIdOrName } = useProject();
  const { integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
  const { installation } = useInstallation();

  const {
    mutate: deleteInstallationMutation,
    isIdle,
    isPending,
    error,
    errorMsg,
  } = useDeleteInstallationMutation();

  const deleteInstallation = ({
    onSuccess,
    onError,
    onSettled,
  }: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
  }) => {
    if (!installation) {
      throw Error("Installation not found. Not able to delete installation.");
    }
    if (!integrationObj) {
      throw Error("No integration found");
    }
    return deleteInstallationMutation(
      {
        projectIdOrName,
        integrationId: integrationObj?.id,
        installationId: installation.id,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => {
          onError?.(error);
        },
        onSettled: () => {
          onSettled?.();
        },
      },
    );
  };

  return {
    deleteInstallation,
    isIdle,
    isPending,
    error,
    errorMsg,
  };
}

import { useQueryClient } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useDeleteInstallationMutation } from "src/hooks/mutation/useDeleteInstallationMutation";
import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";

import { useInstallationProps } from "../InstallationProvider";

import { useInstallation } from "./useInstallation";
import { useInstallationValidation } from "./useInstallationValidation";

/**
 * delete installation hook
 * @returns {Object} An object containing:
 *   - `deleteInstallation` (function): A function to delete the installation.
 *   - `canDelete` (boolean): Whether the installation can be deleted.
 *   - `validationErrors` (Object): Detailed validation error information.
 *   - `isIdle` (boolean): Whether the mutation is idle.
 *   - `isPending` (boolean): Whether the mutation is pending.
 *   - `error` (Error | null): The error object, if any.
 *   - `errorMsg` (string | null): The error message, if any.
 */
export function useDeleteInstallation() {
  const { projectIdOrName } = useAmpersandProviderProps();
  const { integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
  const { installation } = useInstallation();
  const { canDelete, validationErrors } = useInstallationValidation();
  const queryClient = useQueryClient();
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
      const error = new Error(
        "Installation not found. Not able to delete installation.",
      );
      onError?.(error);
      onSettled?.();
      return;
    }
    if (!integrationObj) {
      const error = new Error("No integration found");
      onError?.(error);
      onSettled?.();
      return;
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
          // invalidate installations and connections queries
          queryClient.invalidateQueries({
            queryKey: ["amp", "installations"],
          });
          queryClient.invalidateQueries({
            queryKey: ["amp", "connections"],
          });
        },
      },
    );
  };

  return {
    deleteInstallation,
    canDelete,
    validationErrors,
    isIdle,
    isPending,
    error,
    errorMsg,
  };
}

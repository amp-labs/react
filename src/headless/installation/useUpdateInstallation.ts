import {
  Installation,
  UpdateInstallationOperationRequest,
} from "@generated/api/src";
import { useQueryClient } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useUpdateInstallationMutation } from "src/hooks/mutation/useUpdateInstallationMutation";
import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";

import type { InstallationConfigContent } from "../config/types";
import { toUpdateConfigContent } from "../config/types";
import { useInstallationProps } from "../InstallationProvider";

import { useInstallation } from "./useInstallation";

/**
 * update installation hook
 * @returns {Object} An object containing:
 *   - `updateInstallation` (function): A function to update the installation.
 *   - `isIdle` (boolean): Whether the mutation is idle.
 *   - `isPending` (boolean): Whether the mutation is pending.
 *   - `error` (Error | null): The error object, if any.
 *   - `errorMsg` (string | null): The error message, if any.
 */
export function useUpdateInstallation() {
  const { projectIdOrName } = useAmpersandProviderProps();
  const { integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
  const { installation } = useInstallation();
  const queryClient = useQueryClient();
  const {
    mutate: updateInstallationMutation,
    isIdle,
    isPending,
    error,
    errorMsg,
  } = useUpdateInstallationMutation();

  const updateInstallation = ({
    config,
    onSuccess,
    onError,
    onSettled,
  }: {
    config: InstallationConfigContent;
    onSuccess?: (data: Installation) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
  }) => {
    if (!installation) {
      const error = new Error(
        "Installation not created yet. Try creating the installation first.",
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

    // add write objects to update mask
    const updateMask = [];
    const currentWriteObjectsLength = Object.keys(
      config?.write?.objects || {},
    ).length;
    const previousWriteObjectsLength = Object.keys(
      installation?.config?.content?.write?.objects || {},
    ).length;

    // push update mask if write objects length > 0 or if length === 0 and installation had objects previously
    if (
      currentWriteObjectsLength > 0 ||
      (currentWriteObjectsLength === 0 && previousWriteObjectsLength > 0)
    ) {
      updateMask.push("config.content.write.objects");
    }

    // add read objects to update mask
    if (config?.read?.objects) {
      const objectNames = Object.keys(config.read.objects);
      // add all read objects to update mask
      updateMask.push(
        ...objectNames.map((name) => `config.content.read.objects.${name}`),
      );
    }

    // assemble update installation requests from providers
    const updateInstallationRequest: UpdateInstallationOperationRequest = {
      projectIdOrName,
      integrationId: integrationObj?.id,
      installationId: installation.id,
      installationUpdate: {
        updateMask,
        installation: {
          config: {
            content: toUpdateConfigContent(config),
          },
        },
      },
    };

    return updateInstallationMutation(updateInstallationRequest, {
      onSuccess: (data) => {
        onSuccess?.(data);
      },
      onError: (error) => {
        onError?.(error);
      },
      onSettled: () => {
        onSettled?.();
        queryClient.invalidateQueries({
          queryKey: ["amp", "installations"],
        });
      },
    });
  };

  return {
    updateInstallation,
    isIdle,
    isPending,
    error,
    errorMsg,
  };
}

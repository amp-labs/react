import {
  CreateInstallationOperationRequest,
  Installation,
} from "@generated/api/src";
import { useQueryClient } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useCreateInstallationMutation } from "src/hooks/mutation/useCreateInstallationMutation";
import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";

import type { InstallationConfigContent } from "../config/types";
import { toCreateConfigContent } from "../config/types";
import { useInstallationProps } from "../InstallationProvider";
import { useConnection } from "../useConnection";

import { useInstallation } from "./useInstallation";

/**
 * create installation hook
 * @returns {Object} An object containing:
 *   - `createInstallation` (function): A function to create the installation.
 *   - `isIdle` (boolean): Whether the mutation is idle.
 *   - `isPending` (boolean): Whether the mutation is pending.
 *   - `error` (Error | null): The error object, if any.
 *   - `errorMsg` (string | null): The error message, if any.
 */
export function useCreateInstallation() {
  const { projectIdOrName } = useAmpersandProviderProps();
  const { groupRef, integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
  const { connection } = useConnection();
  const { installation } = useInstallation();
  const queryClient = useQueryClient();
  const {
    mutate: createInstallationMutation,
    isIdle,
    isPending,
    error,
    errorMsg,
  } = useCreateInstallationMutation();

  const createInstallation = ({
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
    if (installation) {
      const error = new Error("Installation already created. Try updating instead.");
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

    // Validate config before creating installation
    const configResult = toCreateConfigContent(config);
    if (configResult.error || !configResult.data) {
      onError?.(configResult.error || new Error("Invalid config"));
      onSettled?.();
      return;
    }

    // assemble create installation requests from providers
    const createInstallationRequest: CreateInstallationOperationRequest = {
      projectIdOrName,
      integrationId: integrationObj?.id,
      installation: {
        groupRef,
        connectionId: connection?.id,
        config: {
          content: configResult.data,
        },
      },
    };

    return createInstallationMutation(createInstallationRequest, {
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
    createInstallation,
    isIdle,
    isPending,
    error,
    errorMsg,
  };
}

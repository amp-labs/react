import {
  ConfigContent,
  CreateInstallationOperationRequest,
  Installation,
} from "@generated/api/src";
import { useProject } from "src/context/ProjectContextProvider";
import { useCreateInstallationMutation } from "src/hooks/mutation/useCreateInstallationMutation";
import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";

import { useInstallationProps } from "../InstallationProvider";
import { useConnection } from "../useConnection";

import { useInstallation } from "./useInstallation";

/**
 * create installation hook
 * @returns
 */
export function useCreateInstallation() {
  const { projectIdOrName } = useProject();
  const { groupRef, integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
  const { connection } = useConnection();
  const { installation } = useInstallation();

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
    config: ConfigContent;
    onSuccess?: (data: Installation) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
  }) => {
    if (installation) {
      throw Error("Installation already created. Try updating instead.");
    }
    if (!integrationObj) {
      throw Error("No integration found");
    }
    // assemble create installation requests from providers
    const createInstallationRequest: CreateInstallationOperationRequest = {
      projectIdOrName,
      integrationId: integrationObj?.id,
      installation: {
        groupRef,
        connectionId: connection?.id,
        config: { content: config },
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

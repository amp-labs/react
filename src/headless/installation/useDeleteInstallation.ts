import { useProject } from "src/context/ProjectContextProvider";
import { useDeleteInstallationMutation } from "src/hooks/mutation/useDeleteInstallationMutation";
import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";

import { useInstallationProps } from "../InstallationProvider";

import { useInstallation } from "./useInstallation";

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

  const deleteInstallation = () => {
    if (!installation) {
      throw Error("Installation not found. Not able to delete installation.");
    }
    if (!integrationObj) {
      throw Error("No integration found");
    }
    return deleteInstallationMutation({
      projectIdOrName,
      integrationId: integrationObj?.id,
      installationId: installation.id,
    });
  };

  return {
    deleteInstallation,
    isIdle,
    isPending,
    error,
    errorMsg,
  };
}

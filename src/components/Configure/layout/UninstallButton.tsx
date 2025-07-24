import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useAPI } from "services/api";
import { Button } from "src/components/ui-base/Button";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { handleServerError } from "src/utils/handleServerError";

interface UninstallButtonProps {
  buttonText: string;
  buttonVariant?: string;
  buttonStyle?: React.CSSProperties;
}

const useDeleteInstallationMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectIdOrName,
      integrationId,
      installationId,
    }: any) => {
      const api = await getAPI();
      return api.installationApi.deleteInstallation({
        projectIdOrName,
        integrationId,
        installationId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amp", "installations"] });
    },
    onError: (error) => {
      console.error("Error uninstalling installation.");
      handleServerError(error);
    },
  });
};

export function UninstallButton({
  buttonText,
  buttonVariant = "secondary",
  buttonStyle = {},
}: UninstallButtonProps) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const {
    integrationId,
    installation,
    setIntegrationDeleted,
    onUninstallSuccess,
  } = useInstallIntegrationProps();
  const [loading, setLoading] = useState<boolean>(false);
  const isDisabled =
    !projectIdOrName || !integrationId || !installation?.id || loading;

  const deleteInstallationMutation = useDeleteInstallationMutation();

  const onDelete = async () => {
    if (!isDisabled) {
      setLoading(true);
      console.warn("uninstalling installation", {
        projectIdOrName,
        integrationId,
        installationId: installation.id,
      });

      deleteInstallationMutation.mutate(
        {
          projectIdOrName,
          integrationId,
          installationId: installation.id,
        },
        {
          onSuccess: () => {
            console.warn(
              "successfully uninstalled installation:",
              installation.id,
            );
            onUninstallSuccess?.(installation?.id); // callback
            setIntegrationDeleted(); // set the ui terminal deleted state
          },
          onSettled: () => setLoading(false),
        },
      );
    }
  };

  const buttonContent = loading ? "Uninstalling..." : buttonText;

  const ButtonComponent = (
    <Button
      type="button"
      onClick={onDelete}
      disabled={isDisabled}
      variant={buttonVariant as "danger" | "ghost" | undefined}
      style={buttonStyle}
    >
      {buttonContent}
    </Button>
  );

  return installation?.id ? ButtonComponent : null;
}

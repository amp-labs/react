import { Installation } from "@generated/api/src";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useInstallation } from "src/headless/installation/useInstallation";
import { useInstallationProps } from "src/headless/InstallationProvider";
import { useUpdateInstallationMutation } from "src/hooks/mutation/useUpdateInstallationMutation";
import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";

/**
 * Hook to toggle reading from an object (enable/disable)
 */
export function useToggleReadingObject() {
  const { projectIdOrName } = useAmpersandProviderProps();
  const { integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
  const { installation } = useInstallation();
  const {
    mutate: updateInstallationMutation,
    isIdle,
    isPending,
    error,
    errorMsg,
  } = useUpdateInstallationMutation();

  const toggleReadingObject = ({
    objectName,
    disabled,
    onSuccess,
    onError,
    onSettled,
  }: {
    objectName: string;
    disabled: boolean;
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

    // Check if the object exists in the current installation
    if (!installation?.config?.content?.read?.objects?.[objectName]) {
      const error = new Error(
        `Object "${objectName}" not found in installation read configuration`,
      );
      onError?.(error);
      onSettled?.();
      return;
    }

    const updateMask = [`config.content.read.objects.${objectName}.disabled`];

    const updateInstallationRequest = {
      projectIdOrName,
      integrationId: integrationObj.id,
      installationId: installation.id,
      installationUpdate: {
        updateMask,
        installation: {
          config: {
            content: {
              read: {
                objects: {
                  [objectName]: {
                    disabled,
                  },
                },
              },
            },
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
      },
    });
  };

  return {
    toggleReadingObject,
    isIdle,
    isPending,
    error,
    errorMsg,
  };
}

import { useState } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api } from 'services/api';
import { Button } from 'src/components/ui-base/Button';
import { useConnections } from 'src/context/ConnectionsContextProvider';
import { handleServerError } from 'src/utils/handleServerError';

interface UninstallButtonProps {
  buttonText: string;
  buttonVariant?: string;
  buttonStyle?: React.CSSProperties;
}

export function UninstallButton({
  buttonText,
  buttonVariant = 'secondary',
  buttonStyle = {},
}: UninstallButtonProps) {
  const apiKey = useApiKey();
  const { projectId } = useProject();
  const { setSelectedConnection } = useConnections();
  const {
    integrationId,
    installation,
    resetInstallations,
    setIntegrationDeleted,
    onUninstallSuccess,
  } = useInstallIntegrationProps();
  const [loading, setLoading] = useState<boolean>(false);
  const isDisabled = !projectId || !integrationId || !installation?.id || loading;

  const onDelete = async () => {
    if (!isDisabled) {
      setLoading(true);
      console.warn('uninstalling installation', {
        projectId,
        integrationId,
        installationId: installation.id,
      });
      try {
        await api().installationApi.deleteInstallation(
          { projectIdOrName: projectId, integrationId, installationId: installation.id },
          {
            headers: {
              'X-Api-Key': apiKey,
              'Content-Type': 'application/json',
            },
          },
        );

        console.warn('successfully uninstalled installation:', installation.id);
        onUninstallSuccess?.(installation?.id); // callback
        resetInstallations();
        setSelectedConnection(null); // reset the connection
        setIntegrationDeleted(); // set the ui terminal deleted state
      } catch (e) {
        console.error('Error uninstalling installation.');
        handleServerError(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const buttonContent = loading ? 'Uninstalling...' : buttonText;

  const ButtonComponent = (
    <Button
      type="button"
      onClick={onDelete}
      disabled={isDisabled}
      variant={buttonVariant as 'danger' | 'ghost' | undefined}
      style={buttonStyle}
    >
      {buttonContent}
    </Button>
  );

  return installation?.id ? ButtonComponent : null;
}

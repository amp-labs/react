import { useState } from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api } from 'services/api';
import { Button } from 'src/components/ui-base/Button';
import { isChakraRemoved } from 'src/components/ui-base/constant';
import { handleServerError } from 'src/utils/handleServerError';

export function UninstallContent() {
  const apiKey = useApiKey();
  const { projectId, appName } = useProject();
  const {
    integrationId, installation, resetInstallations, setIntegrationDeleted, onUninstallSuccess,
  } = useInstallIntegrationProps();
  const [loading, setLoading] = useState<boolean>(false);
  const isDisabled = !projectId || !integrationId || !installation?.id || loading;

  const onDelete = async () => {
    if (!isDisabled) {
      setLoading(true);
      console.warn(
        'uninstalling installation',
        { projectId, integrationId, installationId: installation.id },
      );
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

        console.warn('successfully uninstalled installation: ', installation.id);
        onUninstallSuccess?.(installation?.id); // callback
        resetInstallations();
        setIntegrationDeleted();
      } catch (e) {
        console.error('Error uninstalling installation.');
        handleServerError(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const buttonContent = loading ? 'Uninstalling...' : 'Yes, uninstall';
  const content = installation?.id
    ? `Once you uninstall this integration, all your configuration will be lost, and "${appName}" may stop working.`
    : "You've successfully uninstalled the integration.";

  const ButtonBridge = isChakraRemoved
    ? <Button type="button" onClick={onDelete} disabled={isDisabled} variant="danger">{buttonContent}</Button>
    : (
      <ChakraButton onClick={onDelete} variant="warning" isDisabled={isDisabled}>
        {buttonContent}
      </ChakraButton>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p>{content}</p>

      { installation?.id && ButtonBridge }
    </div>
  );
}

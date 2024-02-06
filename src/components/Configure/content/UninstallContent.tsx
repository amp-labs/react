import { useState } from 'react';
import { Button, Stack, Text } from '@chakra-ui/react';

import { useApiKey } from '../../../context/ApiKeyContextProvider';
import { useInstallIntegrationProps } from '../../../context/InstallIntegrationContextProvider';
import { useProject } from '../../../context/ProjectContextProvider';
import { api } from '../../../services/api';

export function UninstallContent() {
  const apiKey = useApiKey();
  const { projectId, appName } = useProject();
  const { integrationId, installation, resetInstallations } = useInstallIntegrationProps();
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
          { projectId, integrationId, installationId: installation.id },
          {
            headers: {
              'X-Api-Key': apiKey,
              'Content-Type': 'application/json',
            },
          },
        );
        resetInstallations();
        console.warn('successfully uninstalled installation: ', installation.id);
      } catch (e) {
        console.error('error uninstalling installation', e);
      } finally {
        setLoading(false);
      }
    }
  };

  const buttonContent = loading ? 'Uninstalling...' : 'Yes, uninstall';
  const content = installation?.id
    ? `Once you uninstall this integration, all your configuration will be lost, and "${appName}" may stop working.`
    : "You've successfully uninstalled the integration.";

  return (
    <Stack>
      <Text paddingBottom={3}>{content}</Text>

      { installation?.id && (
      <Button onClick={onDelete} variant="warning" isDisabled={isDisabled}>
        {buttonContent}
      </Button>
      )}
    </Stack>
  );
}

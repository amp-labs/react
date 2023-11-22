import { useState } from 'react';
import { Button, Stack } from '@chakra-ui/react';

import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';

export function UninstallContent() {
  const { projectId } = useProject();
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
        await api().deleteInstallation(
          { projectId, integrationId, installationId: installation.id },
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
  const content = installation?.id ? `Once you uninstall this integration with Salesforce, all of your current historical
  configuration will be lost, and you app may stop working.`
    : 'The uninstallation process was successful.';

  return (
    <Stack>
      <div>{content}</div>
      {/* todo create warning variants */}
      <Button onClick={onDelete} variant="warning" isDisabled={isDisabled}>
        {buttonContent}
      </Button>
    </Stack>
  );
}

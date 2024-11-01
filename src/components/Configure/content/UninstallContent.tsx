import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';

import { UninstallButton } from '../layout/UninstallButton';

export function UninstallContent() {
  const { appName } = useProject();
  const { installation } = useInstallIntegrationProps();

  const content = installation?.id
    ? `Once you uninstall this integration, all your configuration will be lost, and "${appName}" may stop working.`
    : "You've successfully uninstalled the integration.";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p>{content}</p>
      <UninstallButton buttonText="Yes, uninstall" buttonVariant="danger" />
    </div>
  );
}

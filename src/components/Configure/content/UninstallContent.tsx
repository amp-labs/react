import {
  useInstallIntegrationProps,
} from 'context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';

import { UninstallButton } from '../layout/UninstallButton';

export function UninstallContent() {
  const { appName } = useProject();
  const { installation } = useInstallIntegrationProps();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {installation?.id
        ? (
          <p>Once you uninstall this integration, all your configuration will be lost, and
            {' '}
            <b>{appName}</b> may stop working.
          </p>
        )
        : <p>You've successfully uninstalled the integration.</p>}

      <UninstallButton buttonText="Yes, uninstall" buttonVariant="danger" />
    </div>
  );
}

import {
  useInstallIntegrationProps,
} from 'context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';

import { UninstallButton } from '../layout/UninstallButton';

export function UninstallContent() {
  const { installation } = useInstallIntegrationProps();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {installation?.id
        ? (
          <p>Once you uninstall this integration, it's configuration will be lost.</p>
        )
        : <p>You've successfully uninstalled the integration.</p>}

      <UninstallButton buttonText="Yes, uninstall" buttonVariant="danger" />
    </div>
  );
}

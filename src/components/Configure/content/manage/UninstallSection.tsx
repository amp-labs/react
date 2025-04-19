import { UninstallButton } from 'src/components/Configure/layout/UninstallButton';
import { useInstallIntegrationProps } from
  'src/context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { useProject } from 'src/context/ProjectContextProvider';
import { useProvider } from 'src/hooks/useProvider';

import { FieldHeader } from '../fields/FieldHeader';

export function UninstallSection() {
  const { installation } = useInstallIntegrationProps();
  const { project } = useProject();
  const { providerName } = useProvider();
  const appName = project?.appName || '';

  // cannot uninstall if installation is not found
  if (!installation) return null;

  return (
    <>
      <FieldHeader string="Uninstall entire integration" />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0',
      }}
      >
        {installation?.id ? (
          <p style={{ color: 'var(--amp-colors-text-muted)' }}>
            By clicking below, you will uninstall the entire {providerName} integration. You will lose any configuration you've set up.
          </p>
        ) : (
          <p>You've successfully uninstalled the integration.</p>
        )}
        <UninstallButton buttonText="Yes, uninstall" buttonVariant="danger" />
      </div>
    </>
  );
}

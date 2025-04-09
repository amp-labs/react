import { UninstallButton } from 'src/components/Configure/layout/UninstallButton';
import { useInstallIntegrationProps } from
  'src/context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { useProject } from 'src/context/ProjectContextProvider';

import { FieldHeader } from '../fields/FieldHeader';

export function UninstallSection() {
  const { provider, installation } = useInstallIntegrationProps();
  const { project } = useProject();
  const appName = project?.appName || '';
  return (
    <>
      <FieldHeader string="Uninstall entire integration" />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0',
      }}
      >
        {installation?.id ? (
          <p style={{ color: 'var(--amp-colors-text-muted)' }}>{`By clicking below, you will uninstall your entire
            ${provider} integration and may lose functionality in
            ${appName}`}.
          </p>
        ) : (
          <p>You've successfully uninstalled the integration.</p>
        )}
        <UninstallButton buttonText="Yes, uninstall" buttonVariant="danger" />
      </div>
    </>
  );
}

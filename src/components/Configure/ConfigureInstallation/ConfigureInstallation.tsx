import { InstallationContent } from './content/InstallationContent';
import { ObjectManagementNav } from './nav/ObjectManagementNav';
import { ConfigurationProvider } from './state/ConfigurationStateProvider';

/**
 * renders the configuration state provider, object management nav, and installation content
 * @returns
 */
export function ConfigureInstallation() {
  return (
    <ConfigurationProvider>
      <ObjectManagementNav>
        <InstallationContent />
      </ObjectManagementNav>
    </ConfigurationProvider>
  );
}

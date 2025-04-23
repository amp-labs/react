import { AuthenticationSection } from './AuthenticationSection';
import { UninstallSection } from './UninstallSection';
import { UpdateConnectionSection } from './updateConnection/UpdateConnectionSection';
/**
 * ManageContent is the content for the manage tab.
 * It displays the connection details, update the connection details, and uninstall the integration.
 * @returns
 */
export function ManageContent() {
  return (
    <>
      <AuthenticationSection />
      <UpdateConnectionSection />
      <UninstallSection />
    </>
  );
}

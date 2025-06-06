import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";

import { RemoveConnectionSection } from "components/Connect/RemoveConnectionSection";

import { AuthenticationSection } from "./AuthenticationSection";
import { UninstallSection } from "./UninstallSection";
import { UpdateConnectionSection } from "./updateConnection/UpdateConnectionSection";
/**
 * ManageContent is the content for the manage tab.
 * It displays the connection details, update the connection details, and uninstall the integration.
 * @returns
 */
export function ManageContent() {
  const { installation, resetComponent } = useInstallIntegrationProps();

  return (
    <>
      <AuthenticationSection />
      <UpdateConnectionSection />
      {/* Uninstall section is only shown if the integration is installed */}
      {installation && <UninstallSection />}
      {/* Remove connection section is only shown if the integration is not installed */}
      {!installation && (
        <RemoveConnectionSection resetComponent={resetComponent} />
      )}
    </>
  );
}

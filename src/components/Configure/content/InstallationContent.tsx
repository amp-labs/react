import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";

import { ErrorTextBox } from "../../ErrorTextBox/ErrorTextBox";

import { CreateInstallation } from "./CreateInstallation";
import { UpdateInstallation } from "./UpdateInstallation";

export function InstallationContent() {
  const { integrationObj, installation } = useInstallIntegrationProps();

  if (!integrationObj) {
    return <ErrorTextBox message={"We can't load the integration"} />;
  }

  return installation && integrationObj ? (
    // If installation exists, render update installation flow
    <UpdateInstallation
      installation={installation}
      integrationObj={integrationObj}
    />
  ) : (
    // No installation, render create installation flow
    <CreateInstallation />
  );
}

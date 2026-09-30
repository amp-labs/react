import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Button } from "src/components/ui-base/Button";
import { useInstallAlwaysEnabledObjects } from "src/hooks/useInstallAlwaysEnabledObjects";

import { ErrorTextBox } from "../../ErrorTextBox/ErrorTextBox";
import { LoadingCentered } from "../../Loading";

import { CreateInstallation } from "./CreateInstallation";
import { UpdateInstallation } from "./UpdateInstallation";

export function InstallationContent() {
  const { integrationObj, installation } = useInstallIntegrationProps();
  const {
    isInstalling,
    error: installError,
    retry,
  } = useInstallAlwaysEnabledObjects();

  if (!integrationObj) {
    return <ErrorTextBox message={"We can't load the integration"} />;
  }

  // `enabled: always` objects are installed before the consumer can configure anything, so this
  // renders the update flow once they're saved.
  if (installError) {
    return (
      <ErrorTextBox
        message={`We couldn't set up the objects this integration always reads: ${installError}`}
      >
        <Button type="button" onClick={retry}>
          Retry
        </Button>
      </ErrorTextBox>
    );
  }

  if (isInstalling) {
    return <LoadingCentered />;
  }

  return installation && integrationObj ? (
    // If installation exists, render update installation flow
    <UpdateInstallation installation={installation} />
  ) : (
    // No installation, render create installation flow
    <CreateInstallation />
  );
}

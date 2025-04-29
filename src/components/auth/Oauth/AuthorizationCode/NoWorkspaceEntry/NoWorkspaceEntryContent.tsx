import {
  AuthCardLayout,
  AuthDescription,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";

import { AuthErrorAlert } from "components/auth/AuthErrorAlert/AuthErrorAlert";
import { Button } from "components/ui-base/Button";

import { LandingContentProps } from "./LandingContentProps";

export function NoWorkspaceEntryContent({
  handleSubmit,
  error,
  isButtonDisabled,
  providerName,
}: LandingContentProps) {
  return (
    <AuthCardLayout>
      <AuthTitle>{`Set up ${providerName} integration`}</AuthTitle>
      <AuthDescription>
        {`Click Next to sign into the ${providerName} account you'd like to sync.`}
      </AuthDescription>
      <AuthErrorAlert error={error} />
      <Button
        style={{ marginTop: "1em", width: "100%" }}
        disabled={isButtonDisabled}
        type="submit"
        onClick={handleSubmit}
      >
        Next
      </Button>
    </AuthCardLayout>
  );
}

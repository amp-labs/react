import { useState } from "react";
import { MetadataItemInput } from "@generated/api/src";
import { useProviderAppByProvider } from "src/hooks/query";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";

import { AuthErrorAlert } from "components/auth/AuthErrorAlert/AuthErrorAlert";
import { MetadataInput } from "components/auth/MetadataInput";
import { getPackageInstallUrl } from "components/auth/PackageInstallBanner/getPackageInstallUrl";
import { PackageInstallStep } from "components/auth/PackageInstallBanner/PackageInstallStep";
import { Stepper } from "components/auth/PackageInstallBanner/Stepper";
import { Button } from "components/ui-base/Button";

import { WorkspaceEntryProps } from "./WorkspaceEntryProps";

export function WorkspaceEntryContent({
  handleSubmit,
  setFormData,
  error,
  isButtonDisabled,
  provider,
  providerName,
  metadataInputs,
}: WorkspaceEntryProps) {
  const isSalesforce = provider.startsWith("salesforce");
  const { providerApp, isPending } = useProviderAppByProvider(
    isSalesforce ? provider : undefined,
  );
  const [installDismissed, setInstallDismissed] = useState(false);

  // Wait for the providerApp query before rendering — otherwise we'd flash the
  // subdomain form then flip to the install banner once data arrives.
  if (isSalesforce && isPending) return null;

  const packageInstallUrl = isSalesforce
    ? getPackageInstallUrl(providerApp)
    : null;
  const showInstallStep = !!packageInstallUrl && !installDismissed;

  if (showInstallStep) {
    return (
      <AuthCardLayout>
        <PackageInstallStep
          packageInstallUrl={packageInstallUrl}
          providerName={providerName}
          onSkip={() => setInstallDismissed(true)}
        />
      </AuthCardLayout>
    );
  }

  return (
    <AuthCardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <AuthTitle>{`Set up ${providerName} integration`}</AuthTitle>
        {packageInstallUrl && (
          <Stepper
            currentStep={2}
            onStepClick={() => setInstallDismissed(false)}
          />
        )}
        <AuthErrorAlert error={error} />
        {metadataInputs.map((metadata: MetadataItemInput) => (
          <MetadataInput
            key={metadata.name}
            metadata={metadata}
            onChange={(event) =>
              setFormData(metadata.name, event.currentTarget.value)
            }
          />
        ))}
        <Button
          style={{ width: "100%" }}
          disabled={isButtonDisabled}
          type="submit"
          onClick={handleSubmit}
        >
          Next
        </Button>
      </div>
    </AuthCardLayout>
  );
}

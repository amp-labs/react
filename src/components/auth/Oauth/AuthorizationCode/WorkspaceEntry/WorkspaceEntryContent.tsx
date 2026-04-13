import { useState } from "react";
import { MetadataItemInput } from "@generated/api/src";
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
  const packageInstallUrl = isSalesforce
    ? getPackageInstallUrl(metadataInputs)
    : null;
  const [step, setStep] = useState<"install" | "authorize">(
    packageInstallUrl ? "install" : "authorize",
  );

  if (packageInstallUrl && step === "install") {
    return (
      <AuthCardLayout>
        <PackageInstallStep
          packageInstallUrl={packageInstallUrl}
          providerName={providerName}
          onSkip={() => setStep("authorize")}
        />
      </AuthCardLayout>
    );
  }

  return (
    <AuthCardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <AuthTitle>Set up {providerName} integration</AuthTitle>
        {packageInstallUrl && (
          <Stepper currentStep={2} onStepClick={() => setStep("install")} />
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

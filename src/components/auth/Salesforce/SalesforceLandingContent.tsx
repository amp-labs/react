import { useState } from "react";
import { MetadataItemInput } from "@generated/api/src";
import { useProviderAppByProvider } from "src/hooks/query";
import {
  AuthCardLayout,
  AuthDescription,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";

import { AuthErrorAlert } from "components/auth/AuthErrorAlert/AuthErrorAlert";
import { MetadataInput } from "components/auth/MetadataInput";
import { getPackageInstallUrl } from "components/auth/PackageInstallBanner/getPackageInstallUrl";
import { PackageInstallStep } from "components/auth/PackageInstallBanner/PackageInstallStep";
import { Stepper } from "components/auth/PackageInstallBanner/Stepper";
import { Button } from "components/ui-base/Button";

import { SALESFORCE_WORKSPACE_FIELD } from "./salesforce";

import styles from "./SalesforceLanding.module.css";

export type SalesforceLandingContentProps = {
  handleSubmit: () => void;
  setFormData: (key: string, value: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
  provider: string;
  providerName?: string;
  metadataInputs: MetadataItemInput[];
};

export function SalesforceLandingContent({
  handleSubmit,
  setFormData,
  error,
  isButtonDisabled,
  provider,
  providerName,
  metadataInputs,
}: SalesforceLandingContentProps) {
  const { providerApp, isPending } = useProviderAppByProvider(provider);
  const [installDismissed, setInstallDismissed] = useState(false);

  // Wait for the providerApp query before rendering — otherwise we'd flash the
  // landing then flip to the install banner once data arrives.
  if (isPending) return null;

  const packageInstallUrl = getPackageInstallUrl(providerApp);
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

  const workspaceInput = metadataInputs.find(
    (item) => item.name === SALESFORCE_WORKSPACE_FIELD,
  );

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
        <AuthDescription>
          {`Click Next to sign into the ${providerName} account you'd like to sync.`}
        </AuthDescription>
        <AuthErrorAlert error={error} />
        {workspaceInput && (
          <details className={styles.disclosure}>
            <summary className={styles.summary}>
              Sign in with a custom domain
            </summary>
            <div className={styles.body}>
              <MetadataInput
                metadata={workspaceInput}
                onChange={(event) =>
                  setFormData(
                    SALESFORCE_WORKSPACE_FIELD,
                    event.currentTarget.value,
                  )
                }
              />
            </div>
          </details>
        )}
        <Button
          style={{ width: "100%" }}
          disabled={isButtonDisabled}
          type="submit"
          onClick={handleSubmit}
        >
          {isButtonDisabled && !error ? "Loading..." : "Next"}
        </Button>
      </div>
    </AuthCardLayout>
  );
}

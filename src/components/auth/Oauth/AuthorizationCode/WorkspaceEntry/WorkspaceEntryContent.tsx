import { MetadataItemInput } from "@generated/api/src";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";

import { AuthErrorAlert } from "components/auth/AuthErrorAlert/AuthErrorAlert";
import { MetadataInput } from "components/auth/MetadataInput";
import { Button } from "components/ui-base/Button";

import { WorkspaceEntryProps } from "./WorkspaceEntryProps";

export function WorkspaceEntryContent({
  handleSubmit,
  setFormData,
  error,
  isButtonDisabled,
  providerName,
  metadataInputs,
}: WorkspaceEntryProps) {
  return (
    <AuthCardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <AuthTitle>{`Set up ${providerName} integration`}</AuthTitle>
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

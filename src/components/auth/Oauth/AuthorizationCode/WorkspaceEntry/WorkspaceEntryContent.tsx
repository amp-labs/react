import { MetadataItemInput } from "@generated/api/src";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";

import { AuthErrorAlert } from "components/auth/AuthErrorAlert/AuthErrorAlert";
import { MetadataInput } from "components/auth/MetadataInput";
import { Button } from "components/ui-base/Button";

import { WorkspaceEntryProps } from "./WorkspaceEntryProps";

/**
 *
 * @param param0
 * @returns
 */
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
      <AuthTitle>Enter your {providerName} workspace</AuthTitle>
      <AuthErrorAlert error={error} />
      <br />
      {metadataInputs.map((metadata: MetadataItemInput) => (
        <MetadataInput
          key={metadata.name}
          metadata={metadata}
          onChange={(event) =>
            setFormData(metadata.name, event.currentTarget.value)
          }
          providerName={providerName}
        />
      ))}
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

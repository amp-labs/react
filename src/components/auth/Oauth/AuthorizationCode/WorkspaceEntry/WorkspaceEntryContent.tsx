import { MetadataItemInput } from "@generated/api/src";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";

import { AuthErrorAlert } from "components/auth/AuthErrorAlert/AuthErrorAlert";
import { FormComponent } from "components/form";
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
  metadataFields,
}: WorkspaceEntryProps) {
  return (
    <AuthCardLayout>
      <AuthTitle>Enter your {providerName} workspace</AuthTitle>
      <AuthErrorAlert error={error} />
      <br />
      {metadataFields.map((metadata: MetadataItemInput) => (
        <FormComponent.Input
          key={metadata.name}
          id={metadata.name}
          name={metadata.name}
          type="text"
          placeholder={metadata.displayName || metadata.name}
          onChange={(event) =>
            setFormData(metadata.name, event.currentTarget.value)
          }
        />
      ))}
      <br />
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

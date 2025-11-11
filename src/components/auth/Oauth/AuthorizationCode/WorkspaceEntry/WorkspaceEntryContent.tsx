import { MetadataItemInput } from "@generated/api/src";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";
import { capitalize } from "src/utils";

import { AuthErrorAlert } from "components/auth/AuthErrorAlert/AuthErrorAlert";
import { DocsHelperText } from "components/Docs/DocsHelperText";
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
  metadataInputs,
}: WorkspaceEntryProps) {
  return (
    <AuthCardLayout>
      <AuthTitle>Enter your {providerName} workspace</AuthTitle>
      <AuthErrorAlert error={error} />
      <br />
      {metadataInputs.map((metadata: MetadataItemInput, index: number) => (
        <div
          key={metadata.name}
          style={{
            marginBottom: index === metadataInputs.length - 1 ? "0" : "1.5rem",
          }}
        >
          {metadata.docsURL && (
            <DocsHelperText
              url={metadata.docsURL}
              providerDisplayName={providerName || ""}
              credentialName={
                metadata.displayName || capitalize(metadata.name.toLowerCase())
              }
              prompt={metadata.prompt}
            />
          )}
          <FormComponent.Input
            id={metadata.name}
            name={metadata.name}
            type="text"
            placeholder={metadata.displayName || metadata.name}
            onChange={(event) =>
              setFormData(metadata.name, event.currentTarget.value)
            }
          />
        </div>
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

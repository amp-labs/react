import { useState } from "react";
import { MetadataItemInput } from "@generated/api/src";
import { Connection } from "services/api";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";

import { AuthErrorAlert } from "components/auth/AuthErrorAlert/AuthErrorAlert";
import { MetadataInput } from "components/auth/MetadataInput";
import {
  getProviderMetadata,
  isProviderMetadataValid,
} from "components/auth/providerMetadata";
import { Button } from "components/ui-base/Button";

import { useAmpersandProviderProps } from "../../context/AmpersandContextProvider";
import { useUpdateConnectionMutation } from "../../hooks/mutation/useUpdateConnectionMutation";

interface UpdateConnectionMetadataProps {
  connection: Connection;
  metadataInputs: MetadataItemInput[];
  providerName?: string;
  onSuccess: () => void;
}

/**
 * Shows a metadata form when an existing connection is missing metadata
 * fields required by the current module. Existing metadata values are
 * prefilled, and on submit the connection is updated via the API.
 */
export function UpdateConnectionMetadata({
  connection,
  metadataInputs,
  providerName,
  onSuccess,
}: UpdateConnectionMetadataProps) {
  const { projectIdOrName } = useAmpersandProviderProps();

  // Prefill form data from existing connection metadata
  const existingMetadata = connection.providerMetadata || {};
  const initialFormData: Record<string, string> = {};
  metadataInputs.forEach((field) => {
    const existing = existingMetadata[field.name];
    if (existing?.value) {
      initialFormData[field.name] = existing.value;
    }
  });

  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: updateConnection, isPending: isUpdating } =
    useUpdateConnectionMutation();

  const handleFormDataChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!isProviderMetadataValid(metadataInputs, formData)) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const providerMetadata = getProviderMetadata(metadataInputs, formData);

      // Merge with existing metadata to preserve values not shown in this form
      const mergedMetadata = {
        ...existingMetadata,
        ...providerMetadata,
      };

      await updateConnection({
        projectIdOrName: projectIdOrName || "",
        connectionId: connection.id,
        updateConnectionRequest: {
          updateMask: ["providerMetadata"],
          connection: {
            providerMetadata: mergedMetadata,
          },
        },
      });

      onSuccess();
    } catch (e) {
      console.error("Error updating connection metadata:", e);
      setError(
        e instanceof Error
          ? e.message
          : "An error occurred while updating the connection.",
      );
    }
  };

  return (
    <AuthCardLayout>
      <AuthTitle>Additional information needed for {providerName}</AuthTitle>
      <AuthErrorAlert error={error} />
      <br />
      {metadataInputs.map((metadata: MetadataItemInput) => (
        <MetadataInput
          key={metadata.name}
          metadata={metadata}
          onChange={(event) =>
            handleFormDataChange(metadata.name, event.currentTarget.value)
          }
          defaultValue={initialFormData[metadata.name]}
        />
      ))}
      <Button
        style={{ marginTop: "1em", width: "100%" }}
        disabled={
          !isProviderMetadataValid(metadataInputs, formData) || isUpdating
        }
        type="submit"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </AuthCardLayout>
  );
}

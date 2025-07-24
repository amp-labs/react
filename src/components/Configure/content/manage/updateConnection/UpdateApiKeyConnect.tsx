import { useState } from "react";
import { ApiKeyAuthForm } from "src/components/auth/ApiKeyAuth/ApiKeyAuthContent";
import { IFormType } from "src/components/auth/ApiKeyAuth/LandingContentProps";
import { FormErrorBox } from "src/components/FormErrorBox";
import { FormSuccessBox } from "src/components/FormSuccessBox";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useConnections } from "src/context/ConnectionsContextProvider";
import { useUpdateConnectionMutation } from "src/hooks/mutation/useUpdateConnectionMutation";
import { useProvider } from "src/hooks/useProvider";
import { handleServerError } from "src/utils/handleServerError";

import { FieldHeader } from "../../fields/FieldHeader";

/**
 *
 * @param provider is provided directly for ConnectProvider component
 * @returns
 */
export function UpdateApiKeyConnect({ provider }: { provider?: string }) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const { providerName, data: providerInfo } = useProvider(provider);
  const { selectedConnection, isConnectionsLoading } = useConnections();

  const {
    mutateAsync: updateConnection,
    isPending: isConnectionUpdating,
    error: updateError,
  } = useUpdateConnectionMutation();

  const [localError, setError] = useState<string | null>(null);
  const [successConnect, setSuccessConnect] = useState<boolean>(false);

  const resetSuccessConnect = () => setSuccessConnect(false);

  const handleSuccessConnect = () => {
    setSuccessConnect(true);
    setError(null);
  };

  const error = updateError?.message || localError || null;
  const handleSubmit = async (form: IFormType) => {
    resetSuccessConnect();
    setError(null);

    try {
      await updateConnection(
        {
          projectIdOrName: projectIdOrName || "",
          connectionId: selectedConnection?.id || "",
          updateConnectionRequest: {
            updateMask: ["apiKey"],
            connection: { apiKey: form.apiKey },
          },
        },
        {
          onError: (e) => {
            console.error("Update connection error:", e);
            handleServerError(e, setError);
          },
          onSuccess: () => {
            handleSuccessConnect();
          },
        },
      );
    } catch (e) {
      console.error("Update connection caught error:", e);
      handleServerError(e, setError);
    }
  };

  if (!providerInfo) return null;

  return (
    <>
      <FieldHeader string="Update connection" />
      <div
        style={{
          padding: "1rem 0",
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
        }}
      >
        <p>{`Update ${providerName} API Key`}</p>
        {successConnect && (
          <FormSuccessBox>Connection updated successfully</FormSuccessBox>
        )}
        {error && (
          <FormErrorBox>{`Error updating connection ${error}`}</FormErrorBox>
        )}
        <ApiKeyAuthForm
          provider={providerInfo?.name}
          providerInfo={providerInfo}
          handleSubmit={handleSubmit}
          isButtonDisabled={isConnectionUpdating || isConnectionsLoading}
          buttonVariant="ghost"
          submitButtonType="button"
        />
      </div>
    </>
  );
}

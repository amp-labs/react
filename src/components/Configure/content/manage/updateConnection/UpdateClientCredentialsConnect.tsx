import { useState } from "react";
import { ClientCredentialsForm } from "src/components/auth/Oauth/ClientCredentials/ClientCredentialsContent";
import { ClientCredentialsCredsContent } from "src/components/auth/Oauth/ClientCredentials/ClientCredentialsCredsContent";
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
export function UpdateClientCredentialsConnect({
  provider,
}: {
  provider?: string;
}) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const { selectedConnection, isConnectionsLoading } = useConnections();
  const { providerName, data: providerInfo } = useProvider(provider);
  const {
    mutateAsync: updateConnection,
    isPending: isConnectionUpdating,
    error: updateError,
  } = useUpdateConnectionMutation();

  const [localError, setError] = useState<string | null>(null);
  const [successConnect, setSuccessConnect] = useState<boolean>(false);

  const resetSuccessConnect = () => {
    setSuccessConnect(false);
  };

  const handleSuccessConnect = () => {
    setSuccessConnect(true);
    setError(null);
  };

  const explicitScopesRequired =
    providerInfo?.oauth2Opts?.explicitScopesRequired;
  const error = updateError?.message || localError || null;
  const handleSubmit = async (formData: ClientCredentialsCredsContent) => {
    resetSuccessConnect();
    setError(null);

    try {
      await updateConnection({
        projectIdOrName: projectIdOrName || "",
        connectionId: selectedConnection?.id || "",
        updateConnectionRequest: {
          updateMask: ["oauth2ClientCredentials"],
          connection: {
            oauth2ClientCredentials: {
              clientId: formData.clientId,
              clientSecret: formData.clientSecret,
              scopes: formData.scopes,
            },
          },
        },
      });
      handleSuccessConnect();
    } catch (e) {
      handleServerError(e, setError);
    }
  };

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
        <p>{`Re-authenticate to ${providerName}`}</p>
        {successConnect && (
          <FormSuccessBox>Connection updated successfully</FormSuccessBox>
        )}
        {error && (
          <FormErrorBox>{`Error updating connection ${error}`}</FormErrorBox>
        )}

        <ClientCredentialsForm
          handleSubmit={handleSubmit}
          isButtonDisabled={isConnectionUpdating || isConnectionsLoading}
          explicitScopesRequired={explicitScopesRequired}
          buttonVariant="ghost"
          // We currently do not support updating metadata inputs for connections.
          metadataFields={[]}
        />
      </div>
    </>
  );
}

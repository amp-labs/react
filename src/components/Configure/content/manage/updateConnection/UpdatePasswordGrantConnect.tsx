import { useState } from "react";
import { PasswordGrantForm } from "src/components/auth/Oauth/PasswordGrant/PasswordGrantContent";
import { PasswordGrantCreds } from "src/components/auth/Oauth/PasswordGrant/PasswordGrantCreds";
import { FormErrorBox } from "src/components/FormErrorBox";
import { FormSuccessBox } from "src/components/FormSuccessBox";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useConnections } from "src/context/ConnectionsContextProvider";
import { useUpdateConnectionMutation } from "src/hooks/mutation/useUpdateConnectionMutation";
import { useProvider } from "src/hooks/useProvider";
import { handleServerError } from "src/utils/handleServerError";

import { FieldHeader } from "../../fields/FieldHeader";

/**
 * Re-enters the username and password of a password grant connection, for example
 * after the user changed their password. The server signs in with the new
 * credentials before saving them.
 *
 * @param provider is provided directly for ConnectProvider component
 */
export function UpdatePasswordGrantConnect({
  provider,
}: {
  provider?: string;
}) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const { selectedConnection, isConnectionsLoading } = useConnections();
  const { providerName, data: providerInfo } = useProvider(provider);
  const { mutateAsync: updateConnection, isPending: isConnectionUpdating } =
    useUpdateConnectionMutation();

  const [error, setError] = useState<string | null>(null);
  const [successConnect, setSuccessConnect] = useState<boolean>(false);

  const handleSubmit = async (formData: PasswordGrantCreds) => {
    setSuccessConnect(false);
    setError(null);

    try {
      await updateConnection({
        projectIdOrName: projectIdOrName || "",
        connectionId: selectedConnection?.id || "",
        updateConnectionRequest: {
          updateMask: ["oauth2PasswordCredentials"],
          connection: {
            oauth2PasswordCredentials: {
              username: formData.username,
              password: formData.password,
              clientId: formData.clientId,
              clientSecret: formData.clientSecret,
              scopes: formData.scopes,
            },
          },
        },
      });
      setSuccessConnect(true);
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
        <p>{`Sign in to ${providerName} again`}</p>
        {successConnect && (
          <FormSuccessBox>Connection updated successfully</FormSuccessBox>
        )}
        {error && (
          <FormErrorBox>{`Error updating connection: ${error}`}</FormErrorBox>
        )}

        <PasswordGrantForm
          handleSubmit={handleSubmit}
          isButtonDisabled={isConnectionUpdating || isConnectionsLoading}
          explicitScopesRequired={
            providerInfo?.oauth2Opts?.explicitScopesRequired
          }
          buttonVariant="ghost"
          buttonText="Update"
          // We currently do not support updating metadata inputs for connections.
          metadataInputs={[]}
        />
      </div>
    </>
  );
}

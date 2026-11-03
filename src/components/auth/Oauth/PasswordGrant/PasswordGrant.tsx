import { useCallback, useState } from "react";
import {
  Connection,
  GenerateConnectionOperationRequest,
  MetadataItemInput,
} from "@generated/api/src";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { handleServerError } from "src/utils/handleServerError";

import { LoadingCentered } from "components/Loading";

import { useCreateConnectionMutation } from "../../useCreateConnectionMutation";

import { PasswordGrantContent } from "./PasswordGrantContent";
import { PasswordGrantCreds } from "./PasswordGrantCreds";

type PasswordGrantProps = {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  explicitScopesRequired?: boolean;
  selectedConnection: Connection | null;
  metadataInputs: MetadataItemInput[];
  moduleError?: string | null;
};

/**
 * Connects a provider that uses the OAuth 2.0 password grant. The server signs in
 * with the credentials before it creates the connection, so a wrong password is
 * reported here, with the provider's reason.
 */
export function PasswordGrant({
  provider,
  providerName,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  explicitScopesRequired,
  selectedConnection,
  metadataInputs,
  moduleError,
}: PasswordGrantProps) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const createConnectionMutation = useCreateConnectionMutation();
  const [error, setError] = useState<string | null>(moduleError || null);

  const handleSubmit = useCallback(
    (creds: PasswordGrantCreds) => {
      setError(null);

      const req: GenerateConnectionOperationRequest = {
        projectIdOrName,
        generateConnectionParams: {
          groupName,
          groupRef,
          consumerName,
          consumerRef,
          provider,
          providerWorkspaceRef: creds.providerMetadata?.workspace?.value,
          oauth2PasswordCredentials: {
            username: creds.username,
            password: creds.password,
            // Empty means "none": the provider's default client applies.
            clientId: creds.clientId,
            clientSecret: creds.clientSecret,
            scopes: creds.scopes,
          },
          ...(creds.providerMetadata && {
            providerMetadata: creds.providerMetadata,
          }),
        },
      };

      createConnectionMutation.mutate(req, {
        onError: (err) => handleServerError(err, setError),
      });
    },
    [
      projectIdOrName,
      groupName,
      groupRef,
      consumerName,
      consumerRef,
      provider,
      createConnectionMutation,
    ],
  );

  if (selectedConnection === null) {
    return (
      <PasswordGrantContent
        providerName={providerName}
        handleSubmit={handleSubmit}
        error={error}
        isButtonDisabled={createConnectionMutation.isPending}
        explicitScopesRequired={explicitScopesRequired}
        metadataInputs={metadataInputs}
      />
    );
  }

  return <LoadingCentered />;
}

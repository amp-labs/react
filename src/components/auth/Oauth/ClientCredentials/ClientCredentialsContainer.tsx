/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useCallback, useState } from "react";
import {
  Connection,
  GenerateConnectionOperationRequest,
} from "@generated/api/src";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";

import { LoadingCentered } from "components/Loading";

import { useCreateConnectionMutation } from "../../useCreateConnectionMutation";

import { ClientCredentialsContent } from "./ClientCredentialsContent";
import { ClientCredentialsCredsContent } from "./ClientCredentialsCredsContent";

interface OauthClientCredsContainerProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  explicitScopesRequired?: boolean;
  selectedConnection: Connection | null;
}

/**
 * OauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function ClientCredsContainer({
  provider,
  providerName,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  explicitScopesRequired,
  selectedConnection,
}: OauthClientCredsContainerProps) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const createConnectionMutation = useCreateConnectionMutation();
  const [error, setError] = useState<string | null>(null);

  //  generate connection from client credentials
  const handleSubmit = useCallback(
    (creds: ClientCredentialsCredsContent) => {
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
          oauth2ClientCredentials: {
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
        onError: () => setError("Error loading provider info"), // set local error state
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
      <ClientCredentialsContent
        provider={provider}
        providerName={providerName}
        handleSubmit={handleSubmit}
        error={error}
        explicitScopesRequired={explicitScopesRequired}
      />
    );
  }

  return <LoadingCentered />;
}

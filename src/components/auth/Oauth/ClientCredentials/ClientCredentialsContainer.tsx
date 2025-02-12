/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useCallback, useState } from 'react';
import { Connection, GenerateConnectionOperationRequest } from '@generated/api/src';

import { LoadingCentered } from 'components/Loading';
import { useProject } from 'context/ProjectContextProvider';

import { useCreateConnectionMutation } from '../../useCreateConnectionMutation';

import { ClientCredentialsContent, ClientCredentialsCredsContent } from './ClientCredentialsContent';

interface OauthClientCredsContainerProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  explicitScopesRequired?: boolean;
  explicitWorkspaceRequired?: boolean;
  selectedConnection: Connection | null;
}

/**
 * OauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function ClientCredsContainer({
  provider, providerName,
  consumerRef, consumerName, groupRef, groupName,
  explicitScopesRequired, explicitWorkspaceRequired,
  selectedConnection,
}: OauthClientCredsContainerProps) {
  const { projectIdOrName } = useProject();
  const createConnectionMutation = useCreateConnectionMutation();
  const [error, setError] = useState<string | null>(null);

  //  generate connection from client credentials
  const handleSubmit = useCallback((creds: ClientCredentialsCredsContent) => {
    setError(null);

    const req: GenerateConnectionOperationRequest = {
      projectIdOrName,
      generateConnectionParams: {
        groupName,
        groupRef,
        consumerName,
        consumerRef,
        provider,
        providerWorkspaceRef: creds.workspace,
        oauth2ClientCredentials: {
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          scopes: creds.scopes,
        },
      },
    };

    createConnectionMutation.mutate(req, {
      onError: () => setError('Error loading provider info'), // set local error state
    });
  }, [projectIdOrName, groupName, groupRef, consumerName, consumerRef, provider, createConnectionMutation]);

  if (selectedConnection === null) {
    return (
      <ClientCredentialsContent
        providerName={providerName}
        handleSubmit={handleSubmit}
        error={error}
        explicitScopesRequired={explicitScopesRequired}
        explicitWorkspaceRequired={explicitWorkspaceRequired}
      />
    );
  }

  return <LoadingCentered />;
}

/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useState } from 'react';
import { Connection, GenerateConnectionRequest } from '@generated/api/src';

import { LoadingCentered } from 'components/Loading';
import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

import {
  ClientCredentialsCreds,
  NoWorkspaceClientCredentialsContent,
} from './NoWorkspaceClientCredentialsContent';

interface NoWorkspaceOauthClientCredsFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  explicitScopesRequired?: boolean;
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
}

/**
 * @deprecated remove after chakra is removed
 * NoWorkspaceOauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function NoWorkspaceOauthClientCredsFlow({
  provider, consumerRef, consumerName, groupRef, groupName, explicitScopesRequired, providerName,
  selectedConnection, setSelectedConnection,
}: NoWorkspaceOauthClientCredsFlowProps) {
  const { projectId } = useProject();
  const apiKey = useApiKey();
  const [error, setError] = useState<string | null>(null);

  //  fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async (creds: ClientCredentialsCreds) => {
    setError(null);
    const req: GenerateConnectionRequest = {
      groupName,
      groupRef,
      consumerName,
      consumerRef,
      provider,
      oauth2ClientCredentials: {
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        scopes: creds.scopes,
      },
    };

    api().connectionApi.generateConnection({ projectIdOrName: projectId, generateConnectionParams: req }, {
      headers: { 'X-Api-Key': apiKey ?? '', 'Content-Type': 'application/json' },
    }).then((conn) => {
      setSelectedConnection(conn);
    }).catch((err) => {
      console.error('Error loading provider info.');
      handleServerError(err);
      setError('Error loading provider info');
    });
  };

  if (selectedConnection === null) {
    return (
      <NoWorkspaceClientCredentialsContent
        providerName={providerName}
        handleSubmit={handleSubmit}
        error={error}
        explicitScopesRequired={explicitScopesRequired}
      />
    );
  }

  return <LoadingCentered />;
}

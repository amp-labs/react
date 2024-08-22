/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useState } from 'react';
import { Connection, GenerateConnectionRequest } from '@generated/api/src';

import {
  ClientCredentialsContent,
  ClientCredentialsCreds,
} from 'components/Oauth/NoWorkspaceEntry/ClientCredentialsContent';
import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api } from 'services/api';
import { LoadingIcon } from 'src/assets/LoadingIcon';

interface NoWorkspaceOauthClientCredsFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
}

/**
 * NoWorkspaceOauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function NoWorkspaceOauthClientCredsFlow({
  provider, consumerRef, consumerName, groupRef, groupName, selectedConnection, setSelectedConnection, providerName,
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
      },
    };

    api().connectionApi.generateConnection({ projectIdOrName: projectId, generateConnectionParams: req }, {
      headers: { 'X-Api-Key': apiKey ?? '', 'Content-Type': 'application/json' },
    }).then((conn) => {
      setSelectedConnection(conn);
    }).catch((err) => {
      console.error('Error loading provider info: ', err);
      setError('Error loading provider info');
    });
  };

  if (selectedConnection === null) {
    return <ClientCredentialsContent handleSubmit={handleSubmit} error={error} providerName={providerName} />;
  }

  return <LoadingIcon />;
}

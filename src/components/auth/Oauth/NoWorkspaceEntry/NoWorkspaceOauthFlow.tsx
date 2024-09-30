/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useCallback, useState } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { handleServerError } from 'src/utils/handleServerError';

import { fetchOAuthPopupURL } from '../fetchOAuthPopupURL';
import { OAuthWindow } from '../OAuthWindow/OAuthWindow';

import { NoWorkspaceEntryContent } from './NoWorkspaceEntryContent';

interface NoWorkspaceOauthFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
}

/**
 * NoWorkspaceOauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function NoWorkspaceOauthFlow({
  provider, consumerRef, consumerName, groupRef, groupName, providerName,
}: NoWorkspaceOauthFlowProps) {
  const { projectId } = useProject();
  const apiKey = useApiKey();

  const [oAuthPopupURL, setOAuthPopupURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  //  fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async () => {
    setError(null);
    try {
      const url = await fetchOAuthPopupURL(
        projectId,
        consumerRef,
        groupRef,
        apiKey,
        provider,
        undefined,
        consumerName,
        groupName,
      );
      setOAuthPopupURL(url);
    } catch (err: any) {
      console.error('Could not fetch OAuth popup URL.');
      handleServerError(err);
      setError(err.message ?? 'Unexpected error');
    }
  };

  const onError = useCallback((err: string | null) => {
    setError(err);
    setOAuthPopupURL(null);
  }, []);

  return (
    <OAuthWindow
      windowTitle={`Connect to ${providerName}`}
      oauthUrl={oAuthPopupURL}
      onError={onError}
    >
      <NoWorkspaceEntryContent handleSubmit={handleSubmit} error={error} providerName={providerName} />
    </OAuthWindow>
  );
}

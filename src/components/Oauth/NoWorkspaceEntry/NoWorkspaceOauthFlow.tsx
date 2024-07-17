/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useCallback, useState } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { capitalize } from 'src/utils';

import { fetchOAuthPopupURL } from '../fetchOAuthPopupURL';
import { OAuthWindow } from '../OAuthWindow/OAuthWindow';

import { LandingContent } from './LandingContent';

interface NoWorkspaceOauthFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
}

/**
 * NoWorkspaceOauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function NoWorkspaceOauthFlow({
  provider, consumerRef, consumerName, groupRef, groupName,
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
      console.error('Could not fetch OAuth popup URL', { err });
      setError(err.message ?? 'Unexpected error');
    }
  };

  const onClose = useCallback((err: string | null) => {
    setError(err);
    setOAuthPopupURL(null);
  }, []);

  return (
    <OAuthWindow
      windowTitle={`Connect to ${capitalize(provider)}`}
      oauthUrl={oAuthPopupURL}
      onClose={onClose}
    >
      <LandingContent provider={provider} handleSubmit={handleSubmit} error={error} />
    </OAuthWindow>
  );
}

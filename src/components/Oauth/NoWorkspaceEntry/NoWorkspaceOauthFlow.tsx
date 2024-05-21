/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useCallback, useState } from 'react';

import { useApiKey } from '../../../context/ApiKeyContextProvider';
import { useProject } from '../../../context/ProjectContextProvider';
import { capitalize } from '../../../utils';
import { fetchOAuthCallbackURL } from '../fetchOAuthCallbackURL';
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

  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  //  fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async () => {
    setError(null);
    try {
      const url = await fetchOAuthCallbackURL(
        projectId,
        consumerRef,
        groupRef,
        apiKey,
        provider,
        undefined,
        consumerName,
        groupName,
      );
      setOAuthCallbackURL(url);
    } catch (err: any) {
      console.error('Could not fetch OAuthCallback URL', { err });
      setError(err.message ?? 'Unexpected error');
    }
  };

  const onClose = useCallback((err: string | null) => {
    setError(err);
    setOAuthCallbackURL(null);
  }, []);

  return (
    <OAuthWindow
      windowTitle={`Connect to ${capitalize(provider)}`}
      oauthUrl={oAuthCallbackURL}
      onClose={onClose}
    >
      <LandingContent provider={provider} handleSubmit={handleSubmit} error={error} />
    </OAuthWindow>
  );
}

/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useCallback, useState } from 'react';

import { useApiKey } from '../../../context/ApiKeyContextProvider';
import { useProject } from '../../../context/ProjectContextProvider';
import { capitalize } from '../../../utils';
import { fetchOAuthCallbackURL } from '../fetchOAuthCallbackURL';
import OAuthPopup from '../OAuthPopup';

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
    if (consumerName && groupName && apiKey) {
      try {
        const url = await fetchOAuthCallbackURL(
          projectId,
          consumerRef,
          groupRef,
          consumerName,
          groupName,
          apiKey,
          provider,
        );
        setOAuthCallbackURL(url);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? 'Unexpected error');
      }
    }
  };

  const onClose = useCallback((err: string | null) => {
    setError(err);
    setOAuthCallbackURL(null);
  }, []);

  return (
    <OAuthPopup
      title={`Connect to ${capitalize(provider)}`}
      url={oAuthCallbackURL}
      onClose={onClose}
    >
      <LandingContent provider={provider} handleSubmit={handleSubmit} error={error} />
    </OAuthPopup>
  );
}

/**
 * OAuth flow for any providers that do not require the consumer to enter a subdomain first.
 */

import { useCallback, useState } from 'react';

import { useApiKey } from '../../../context/ApiKeyContextProvider';
import { useProject } from '../../../context/ProjectContextProvider';
import { capitalize } from '../../../utils';
import OAuthPopup from '../../Connect/OAuthPopup';
import { fetchOAuthCallbackURL } from '../fetchOAuthCallbackURL';

import { LandingContent } from './LandingContent';

interface NoSubdomainOauthFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
}

/**
 * NoSubdomainOauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function NoSubdomainOauthFlow({
  provider, consumerRef, consumerName, groupRef, groupName,
}: NoSubdomainOauthFlowProps) {
  const { projectId } = useProject();
  const apiKey = useApiKey();

  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. fetch provider apps
  // 2. find matching app to provider
  // 3. fetch OAuth callback URL from connection so that oath popup can be launched
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

/**
 * Hubspot landing component, which then will launch to create an OAuth connection to Hubspot.
 */

import { useCallback, useState } from 'react';

import { PROVIDER_HUBSPOT } from '../../../constants';
import { useApiKey } from '../../../context/ApiKeyProvider';
import { useProject } from '../../../context/ProjectContext';
import OAuthPopup from '../../Connect/OAuthPopup';
import { fetchOAuthCallbackURL } from '../fetchOAuthCallbackURL';

import { HubspotLandingContent } from './HubspotLandingContent';

interface HubspotOauthFlowProps {
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
}

/**
 * HubspotOauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function HubspotOauthFlow({
  consumerRef, consumerName, groupRef, groupName,
}: HubspotOauthFlowProps) {
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
          PROVIDER_HUBSPOT,
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
      title="Connect to Hubspot"
      url={oAuthCallbackURL}
      onClose={onClose}
    >
      <HubspotLandingContent handleSubmit={handleSubmit} error={error} />
    </OAuthPopup>
  );
}

/**
 * Prompts customer to input their Salesforce subdomain, then creates an OAuth connection to
 * that Salesforce instance.
 */

import { useCallback, useState } from 'react';

import { PROVIDER_SALESFORCE } from '../../../constants';
import { useApiKey } from '../../../context/ApiKeyProvider';
import { useProject } from '../../../context/ProjectContext';
import OAuthPopup from '../../Connect/OAuthPopup';
import { fetchOAuthCallbackURL } from '../fetchOAuthCallbackURL';

import { SubdomainEntry } from './SubdomainEntry';

interface SalesforceOauthFlowProps {
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
}

/**
 * SalesforceOauthFlow first prompts user for their workspace ("subdomain" in Salesforce lingo),
 * then launches a popup with the OAuth flow.
 */
export function SalesforceOauthFlow({
  consumerRef, consumerName, groupRef, groupName,
}: SalesforceOauthFlowProps) {
  const { projectId } = useProject();
  const apiKey = useApiKey();

  const [workspace, setWorkspace] = useState<string>('');
  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isButtonDisabled = workspace.length === 0;
  const provider = PROVIDER_SALESFORCE;

  // 1. fetch provider apps
  // 2. find matching app to provider
  // 3. fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async () => {
    setError(null);
    if (workspace && consumerName && groupName && apiKey) {
      try {
        const url = await fetchOAuthCallbackURL(
          projectId,
          workspace,
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
    } else {
      setError('missing required fields');
    }
  };

  const onClose = useCallback((err: string | null) => {
    setError(err);
    setOAuthCallbackURL(null);
  }, []);

  return (
    <OAuthPopup
      title="Connect to Salesforce"
      url={oAuthCallbackURL}
      onClose={onClose}
    >
      <SubdomainEntry
        handleSubmit={handleSubmit}
        setWorkspace={setWorkspace}
        error={error}
        isButtonDisabled={isButtonDisabled}
      />
    </OAuthPopup>
  );
}

import { useCallback, useState } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';

import { fetchOAuthPopupURL } from '../fetchOAuthPopupURL';
import { OAuthWindow } from '../OAuthWindow/OAuthWindow';
import { SalesforceSubdomainEntry } from '../Salesforce/SalesforceSubdomainEntry';

import { WorkspaceEntryContent } from './WorkspaceEntryContent';

const PROVIDER_SALESFORCE = 'salesforce';

interface WorkspaceOauthFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
}

/**
 * Chooses workspace/subdomain entry component based on provider.
 * WorkspaceEntry is generic for any provider that requires a workspace to be entered first,
 * then launches a popup with the OAuth flow.
 */
export function WorkspaceOauthFlow({
  provider, consumerRef, consumerName, groupRef, groupName, providerName,
}: WorkspaceOauthFlowProps) {
  const { projectId } = useProject();
  const apiKey = useApiKey();

  const [workspace, setWorkspace] = useState<string>('');
  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  //  fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async () => {
    setError(null);
    if (!workspace) {
      setError('Workspace is required');
      return;
    }

    try {
      const url = await fetchOAuthPopupURL(
        projectId,
        consumerRef,
        groupRef,
        apiKey,
        provider,
        workspace,
        consumerName,
        groupName,
      );
      setOAuthCallbackURL(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Unexpected error');
    }
  };

  const onError = useCallback((err: string | null) => {
    setError(err);
    setOAuthCallbackURL(null);
  }, []);

  // custom entry component for Salesforce provider
  const workspaceEntryComponent = (provider === PROVIDER_SALESFORCE)
    ? (
      <SalesforceSubdomainEntry
        handleSubmit={handleSubmit}
        setWorkspace={setWorkspace}
        error={error}
        isButtonDisabled={workspace.length === 0}
      />
    ) : (
  // general workspace entry component
      <WorkspaceEntryContent
        handleSubmit={handleSubmit}
        setWorkspace={setWorkspace}
        error={error}
        isButtonDisabled={workspace.length === 0}
        providerName={providerName}
      />
    );

  return (
    <OAuthWindow
      windowTitle={`Connect to ${providerName}`}
      oauthUrl={oAuthCallbackURL}
      onError={onError}
    >
      {workspaceEntryComponent}
    </OAuthWindow>
  );
}

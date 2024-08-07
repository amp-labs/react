import { useCallback, useState } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { capitalize } from 'src/utils';

import { fetchOAuthPopupURL } from '../fetchOAuthPopupURL';
import { OAuthWindow } from '../OAuthWindow/OAuthWindow';
import { SalesforceSubdomainEntry } from '../Salesforce/SalesforceSubdomainEntry';

import { WorkspaceEntry } from './WorkspaceEntry';

const PROVIDER_SALESFORCE = 'salesforce';

interface WorkspaceOauthFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
}

/**
 * Chooses workspace/subdomain entry component based on provider.
 * WorkspaceEntry is generic for any provider that requires a workspace to be entered first,
 * then launches a popup with the OAuth flow.
 */
export function WorkspaceOauthFlow({
  provider, consumerRef, consumerName, groupRef, groupName,
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

  const onClose = useCallback((err: string | null) => {
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
      <WorkspaceEntry
        provider={provider}
        handleSubmit={handleSubmit}
        setWorkspace={setWorkspace}
        error={error}
        isButtonDisabled={workspace.length === 0}
      />
    );

  return (
    <OAuthWindow
      windowTitle={`Connect to ${capitalize(provider)}`}
      oauthUrl={oAuthCallbackURL}
      onClose={onClose}
    >
      {workspaceEntryComponent}
    </OAuthWindow>
  );
}

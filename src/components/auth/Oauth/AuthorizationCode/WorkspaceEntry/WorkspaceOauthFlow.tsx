import { useCallback, useState } from "react";

import { OAuthWindow } from "../OAuthWindow/OAuthWindow";
import { useOAuthPopupURL } from "../useOAuthPopupURL";

import { SalesforceSubdomainEntry } from "./Salesforce/SalesforceSubdomainEntry";
import { WorkspaceEntryContent } from "./WorkspaceEntryContent";

const PROVIDER_SALESFORCE = "salesforce";

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
  provider,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  providerName,
}: WorkspaceOauthFlowProps) {
  const [workspace, setWorkspace] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    url: oAuthPopupURL,
    error: oAuthConnectError,
    isLoading,
    refetchOauthConnect,
  } = useOAuthPopupURL(
    consumerRef,
    groupRef,
    provider,
    workspace,
    consumerName,
    groupName,
  );

  const errorMessage = oAuthConnectError?.message || localError || null;
  //  fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async () => {
    setLocalError(null);
    if (!workspace) {
      setLocalError("Workspace is required");
      return;
    }

    refetchOauthConnect();
  };

  const onError = useCallback((err: string | null) => {
    setLocalError(err);
  }, []);

  // custom entry component for Salesforce provider
  const workspaceEntryComponent =
    provider === PROVIDER_SALESFORCE ? (
      <SalesforceSubdomainEntry
        handleSubmit={handleSubmit}
        setWorkspace={setWorkspace}
        error={errorMessage}
        isButtonDisabled={workspace.length === 0}
      />
    ) : (
      // general workspace entry component
      <WorkspaceEntryContent
        handleSubmit={handleSubmit}
        setWorkspace={setWorkspace}
        error={errorMessage}
        isButtonDisabled={workspace.length === 0 || isLoading}
        providerName={providerName}
      />
    );

  return (
    <OAuthWindow
      windowTitle={`Connect to ${providerName}`}
      oauthUrl={oAuthPopupURL || null}
      onError={onError}
      error={errorMessage}
    >
      {workspaceEntryComponent}
    </OAuthWindow>
  );
}

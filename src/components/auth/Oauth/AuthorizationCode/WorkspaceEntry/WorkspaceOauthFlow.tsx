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
  // keeps track of whether the OAuth popup URL should be passed to the OAuthWindow
  // when this is false, then OAuthWindow component will not pop up a window.
  const [showURL, setShowURL] = useState<boolean>(false);

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
  const onError = useCallback((err: string | null) => {
    setLocalError(err);
    setShowURL(false);
  }, []);

  const onSuccessConnect = useCallback(() => {
    setLocalError(null);
    setShowURL(false);
  }, []);

  const onWindowClose = useCallback(() => {
    setShowURL(false);
  }, [setShowURL]);

  //  fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async () => {
    setLocalError(null);
    if (!workspace) {
      setLocalError("Workspace is required");
      return;
    }

    const result = await refetchOauthConnect();
    if (result?.data) {
      setShowURL(true);
    } else {
      onError(result?.error?.message || "Authentication failed");
    }
  };

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
      oauthUrl={(showURL && oAuthPopupURL) || null} // showURL is true when handleSubmit is called
      onError={onError}
      error={errorMessage}
      onSuccessConnect={onSuccessConnect}
      onWindowClose={onWindowClose}
    >
      {workspaceEntryComponent}
    </OAuthWindow>
  );
}

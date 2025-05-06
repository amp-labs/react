/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useCallback, useState } from "react";
import { useConnectionsListQuery } from "src/hooks/query/useConnectionsListQuery";

import { OAuthWindow } from "../OAuthWindow/OAuthWindow";
import { useOAuthPopupURL } from "../useOAuthPopupURL";

import { NoWorkspaceEntryContent } from "./NoWorkspaceEntryContent";

interface NoWorkspaceOauthFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
}

/**
 * NoWorkspaceOauthFlow first prompts user with a next button,
 * then launches a popup with the OAuth flow.
 */
export function NoWorkspaceOauthFlow({
  provider,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  providerName,
}: NoWorkspaceOauthFlowProps) {
  const [localError, setError] = useState<string | null>(null);
  // keeps track of whether the OAuth popup URL should be passed to the OAuthWindow
  const [showURL, setShowURL] = useState<boolean>(false);
  const { isFetching: isConnectionsFetching, refetch: refetchConnections } =
    useConnectionsListQuery({
      groupRef,
      provider,
    });

  const {
    url: oAuthPopupURL,
    error: oAuthConnectError,
    isLoading,
    refetchOauthConnect,
  } = useOAuthPopupURL(
    consumerRef,
    groupRef,
    provider,
    consumerName,
    groupName,
    undefined,
    {},
  );

  const error = oAuthConnectError?.message || localError || null;

  const onError = useCallback(
    (err: string | null) => {
      setError(err);
      setShowURL(false); // do not show the OAuth popup URL after an error occurs
    },
    [setError],
  );

  const onSuccessConnect = useCallback(() => {
    setError(null);
    setShowURL(false); // do not show the OAuth popup URL after the connection is successfully created
    refetchConnections();
  }, [setError, refetchConnections]);

  const onWindowClose = useCallback(() => {
    setShowURL(false); // do not show the OAuth popup URL after the window is closed
    refetchConnections();
  }, [setShowURL, refetchConnections]);

  //  fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async () => {
    setError(null);

    const { data: connections } = await refetchConnections();
    if (connections && connections.length > 0) {
      // first refetch connection before attempting to re-auth
      return;
    }

    const result = await refetchOauthConnect();

    // If the OAuth connection URL is successfully fetched, set showURL to true
    // to display the OAuth popup. Otherwise, handle the error.
    if (result?.data) {
      setShowURL(true);
    } else {
      onError(result?.error?.message || "Authentication failed");
    }
  };

  return (
    <OAuthWindow
      windowTitle={`Connect to ${providerName}`}
      oauthUrl={(showURL && oAuthPopupURL) || null} // showURL is true when handleSubmit is called
      onError={onError}
      error={error}
      onSuccessConnect={onSuccessConnect}
      onWindowClose={onWindowClose}
    >
      <NoWorkspaceEntryContent
        handleSubmit={handleSubmit}
        error={
          // hide error message when the connections are being fetched
          isConnectionsFetching ? "" : error
        }
        providerName={providerName}
        isButtonDisabled={isLoading || isConnectionsFetching} // disable button when loading or fetching connections
      />
    </OAuthWindow>
  );
}

/**
 * OAuth flow for any providers that do not require the consumer to enter a workspace first.
 */

import { useCallback, useState } from 'react';

import { OAuthWindow } from '../OAuthWindow/OAuthWindow';
import { useOAuthPopupURL } from '../useOAuthPopupURL';

import { NoWorkspaceEntryContent } from './NoWorkspaceEntryContent';

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
  provider, consumerRef, consumerName, groupRef, groupName, providerName,
}: NoWorkspaceOauthFlowProps) {
  const [localError, setError] = useState<string | null>(null);

  const {
    url: oAuthPopupURL, error: oAuthConnectError, isLoading, refetchOauthConnect,
  } = useOAuthPopupURL(consumerRef, groupRef, provider, undefined, consumerName, groupName);

  const error = oAuthConnectError?.message || localError || null;
  //  fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async () => {
    setError(null);
    refetchOauthConnect();
  };

  const onError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  return (
    <OAuthWindow
      windowTitle={`Connect to ${providerName}`}
      oauthUrl={oAuthPopupURL || null}
      onError={onError}
    >
      <NoWorkspaceEntryContent
        handleSubmit={handleSubmit}
        error={error}
        providerName={providerName}
        isButtonDisabled={isLoading}
      />
    </OAuthWindow>
  );
}

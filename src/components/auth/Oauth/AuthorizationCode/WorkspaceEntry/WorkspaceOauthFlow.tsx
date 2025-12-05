import { useCallback, useState } from "react";
import {
  isProviderMetadataValid,
  ProviderMetadata,
} from "src/components/auth/providerMetadata";
import { useProviderInfoQuery } from "src/hooks/useProvider";

import { OAuthWindow } from "../OAuthWindow/OAuthWindow";
import { useOAuthPopupURL } from "../useOAuthPopupURL";

import { WorkspaceEntryContent } from "./WorkspaceEntryContent";

interface WorkspaceOauthFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
}

/**
 * @deprecated
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
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);
  // keeps track of whether the OAuth popup URL should be passed to the OAuthWindow
  // when this is false, then OAuthWindow component will not pop up a window.
  const [showURL, setShowURL] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<ProviderMetadata>({});

  const { data: providerInfo } = useProviderInfoQuery(provider);
  const metadataInputs = providerInfo?.metadata?.input || [];

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
    metadata?.workspace?.value,
    metadata,
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

  const handleFormDataChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setMetadata((prev) => ({ ...prev, [key]: { value, source: "input" } }));
  };

  const providerHandleSubmit = async () => {
    setLocalError(null);
    if (!isProviderMetadataValid(metadataInputs, formData)) {
      setLocalError("Please fill in all required fields");
      return;
    }

    const result = await refetchOauthConnect();
    if (result?.data) {
      setShowURL(true);
    } else {
      onError(result?.error?.message || "Authentication failed");
    }
  };

  // general workspace entry component
  const workspaceEntryComponent = (
    <WorkspaceEntryContent
      handleSubmit={providerHandleSubmit}
      setFormData={handleFormDataChange}
      error={errorMessage}
      isButtonDisabled={
        !isProviderMetadataValid(metadataInputs, formData) || isLoading
      }
      providerName={providerName}
      metadataInputs={metadataInputs}
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

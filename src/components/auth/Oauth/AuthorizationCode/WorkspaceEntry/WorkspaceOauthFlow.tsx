import { useCallback, useState } from "react";
import {
  getProviderMetadata,
  isProviderMetadataValid,
  ProviderMetadata,
} from "src/components/auth/providerMetadata";
import { useProviderInfoQuery } from "src/hooks/useProvider";

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
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);
  // keeps track of whether the OAuth popup URL should be passed to the OAuthWindow
  // when this is false, then OAuthWindow component will not pop up a window.
  const [showURL, setShowURL] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<ProviderMetadata>({});

  const { data: providerInfo } = useProviderInfoQuery(provider);
  const metadataFields = providerInfo?.metadata?.input || [];

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
    provider === PROVIDER_SALESFORCE ? workspace : metadata?.workspace?.value,
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

  const setSalesforceWorkspace = (workspace: string) => {
    setWorkspace(workspace);
    setFormData((prev) => ({ ...prev, "workspace": workspace }));
    setMetadata((prev) => ({ ...prev, "workspace": { value: workspace, source: "input" } }));
  };

  const handleFormDataChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setMetadata((prev) => ({ ...prev, [key]: { value, source: "input" } }));
  };

  const providerHandleSubmit = async () => {
    setLocalError(null);
    if (!isProviderMetadataValid(metadataFields, formData)) {
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

  // custom entry component for Salesforce provider
  const workspaceEntryComponent =
    provider === PROVIDER_SALESFORCE ? (
      <SalesforceSubdomainEntry
        handleSubmit={providerHandleSubmit}
        setWorkspace={setSalesforceWorkspace}
        error={errorMessage}
        isButtonDisabled={workspace.length === 0}
      />
    ) : (
      // general workspace entry component
      <WorkspaceEntryContent
        handleSubmit={providerHandleSubmit}
        setFormData={handleFormDataChange}
        error={errorMessage}
        isButtonDisabled={
          !isProviderMetadataValid(metadataFields, formData) || isLoading
        }
        providerName={providerName}
        metadataFields={metadataFields}
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

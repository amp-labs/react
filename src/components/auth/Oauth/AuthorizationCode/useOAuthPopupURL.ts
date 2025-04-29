import { useEffect } from "react";
import { OauthConnectRequest, ProviderApp } from "@generated/api/src";
import { useProject } from "src/context/ProjectContextProvider";
import {
  useListProviderAppsQuery,
  useOauthConnectQuery,
} from "src/hooks/query";
import { useProviderInfoQuery } from "src/hooks/useProvider";
import { getProviderName } from "src/utils";
import { handleServerError } from "src/utils/handleServerError";

import { enableCSRFProtection } from "./enableCSRFprotection";

export const useOAuthPopupURL = (
  consumerRef: string,
  groupRef: string,
  provider: string,
  workspace?: string,
  consumerName?: string,
  groupName?: string,
) => {
  const { projectId } = useProject();
  const {
    data: provInfo,
    isLoading: isProvInfoLoading,
    error: provInfoError,
  } = useProviderInfoQuery(provider);
  const {
    data: providerApps,
    isLoading: isProviderAppsLoading,
    error: providerAppsError,
  } = useListProviderAppsQuery();

  const app = providerApps?.find((a: ProviderApp) => a.provider === provider);
  const providerName = provInfo ? getProviderName(provider, provInfo) : null;

  const request: OauthConnectRequest = {
    providerWorkspaceRef: workspace,
    projectId,
    groupRef,
    groupName,
    consumerRef,
    consumerName,
    providerAppId: app?.id,
    provider,
    enableCSRFProtection,
  };

  const {
    data: url,
    error: oauthConnectError,
    isLoading: isOauthConnectLoading,
    refetch: refetchOauthConnectQuery,
  } = useOauthConnectQuery(request);

  useEffect(() => {
    if (provInfo && provider && !app) {
      console.error(
        `You must first set up a ${providerName} Provider App using the Ampersand Console.`,
      );
    }
  }, [app, providerName, provInfo, provider]);

  useEffect(() => {
    if (provInfoError) {
      console.error("Error fetching provider info:", provInfoError);
      handleServerError(provInfoError);
    }
  }, [provInfoError]);

  useEffect(() => {
    if (providerAppsError) {
      console.error("Error fetching provider apps:", providerAppsError);
      handleServerError(providerAppsError);
    }
  }, [providerAppsError]);

  useEffect(() => {
    if (oauthConnectError) {
      console.error("Error fetching OAuth connect:", oauthConnectError);
      handleServerError(oauthConnectError);
    }
  }, [oauthConnectError]);

  const refetchOauthConnect = () => {
    if (provInfo?.authType === "oauth2") {
      if (
        provInfo?.oauth2Opts?.grantType === "authorizationCode" ||
        provInfo?.oauth2Opts?.grantType === "authorizationCodePKCE"
      ) {
        refetchOauthConnectQuery();
      } else {
        console.error(
          "Provider does not support an OAuth2 web flow grant type.",
        );
      }
    } else {
      console.error("Provider does not support an OAuth2 web flow.");
    }
  };

  return {
    url,
    error: provInfoError || providerAppsError || oauthConnectError,
    isLoading:
      isProvInfoLoading || isProviderAppsLoading || isOauthConnectLoading,
    refetchOauthConnect,
  };
};

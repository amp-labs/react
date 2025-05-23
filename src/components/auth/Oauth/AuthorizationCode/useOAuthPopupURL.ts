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

import { ProviderMetadata } from "../../providerMetadata";

import { enableCSRFProtection } from "./enableCSRFprotection";

export const useOAuthPopupURL = (
  consumerRef: string,
  groupRef: string,
  provider: string,
  consumerName?: string,
  groupName?: string,
  workspace?: string,
  providerMetadata?: ProviderMetadata,
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
    providerWorkspaceRef: workspace || providerMetadata?.workspace?.value,
    projectId,
    groupRef,
    groupName,
    consumerRef,
    consumerName,
    providerAppId: app?.id,
    provider,
    enableCSRFProtection,
    providerMetadata,
  };

  const {
    data: url,
    error: oauthConnectError,
    isLoading: isOauthConnectLoading,
    refetch: refetchOauthConnectQuery,
  } = useOauthConnectQuery(request);

  useEffect(() => {
    if (provInfo && provider && providerApps && !app) {
      console.error(
        `You must first set up a ${providerName} Provider App using the Ampersand Console. `,
        { provInfo, provider, providerApps, app },
      );
    }
  }, [app, providerName, provInfo, provider, providerApps]);

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

  const refetchOauthConnect = async (): Promise<ReturnType<
    typeof refetchOauthConnectQuery
  > | null> => {
    if (provInfo?.authType === "oauth2") {
      if (
        provInfo?.oauth2Opts?.grantType === "authorizationCode" ||
        provInfo?.oauth2Opts?.grantType === "authorizationCodePKCE"
      ) {
        return await refetchOauthConnectQuery();
      } else {
        console.error(
          "Provider does not support an OAuth2 web flow grant type.",
        );
      }
    } else {
      console.error("Provider does not support an OAuth2 web flow.");
    }
    return null;
  };

  return {
    url,
    error: provInfoError || providerAppsError || oauthConnectError,
    isLoading:
      isProvInfoLoading || isProviderAppsLoading || isOauthConnectLoading,
    refetchOauthConnect,
  };
};

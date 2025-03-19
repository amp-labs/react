import { useEffect } from 'react';
import { OauthConnectRequest } from '@generated/api/src/models';
import { useQuery } from '@tanstack/react-query';

import { useProject } from 'context/ProjectContextProvider';
import { useProviderInfoQuery } from 'hooks/useProvider';
import { OauthConnectOperationRequest, ProviderApp, useAPI } from 'services/api';
import { getEnvVariable, getProviderName } from 'src/utils';
import { handleServerError } from 'src/utils/handleServerError';

const VITE_ENABLE_CSRF = getEnvVariable('VITE_AMP_ENABLE_CSRF', false);
const NEXT_ENABLE_CSRF = getEnvVariable('NEXT_AMP_ENABLE_CSRF', false);
const REACT_APP_ENABLE_CSRF = getEnvVariable('REACT_APP_AMP_ENABLE_CSRF', false);

const enableCSRFProtection = !!VITE_ENABLE_CSRF || !!NEXT_ENABLE_CSRF || !!REACT_APP_ENABLE_CSRF;

/**
 * @deprecated use useOAuthPopupURL instead
 * @returns
 */
export const fetchOAuthPopupURL = async (
  projectId: string,
  consumerRef: string,
  groupRef: string,
  apiKey: string,
  provider: string,
  workspace?: string,
  consumerName?: string,
  groupName?: string,
): Promise<string> => {
  const provInfo = await api().providerApi.getProvider({ provider }, {
    headers: { 'X-Api-Key': apiKey ?? '' },
  });
  if (!provInfo) {
    throw new Error(`Provider ${provider} not found`);
  }

  if (provInfo.authType === 'oauth2') {
    if (provInfo.oauth2Opts?.grantType === 'authorizationCode'
      || provInfo.oauth2Opts?.grantType === 'authorizationCodePKCE') {
      const providerApps = await api().providerAppApi.listProviderApps({ projectIdOrName: projectId }, {
        headers: { 'X-Api-Key': apiKey ?? '' },
      });

      const app = providerApps.find((a: ProviderApp) => a.provider === provider);
      const providerName = getProviderName(provider, provInfo);

      if (!app) {
        throw new Error(`You must first set up a ${providerName} Provider App using the Ampersand Console.`);
      }

      const request: OauthConnectOperationRequest = {
        connectOAuthParams: {
          providerWorkspaceRef: workspace,
          projectId,
          groupRef,
          groupName,
          consumerRef,
          consumerName,
          providerAppId: app.id,
          provider,
          enableCSRFProtection,
        },
      };

      const url = await api().oAuthApi.oauthConnect(request, {
        credentials: 'include',
        headers: { 'X-Api-Key': apiKey ?? '', 'Content-Type': 'application/json' },
      });
      return url;
    }
  }

  throw new Error(`Provider ${provider} does not support an OAuth2 web flow.`);
};

export const useListProviderAppsQuery = () => {
  const getAPI = useAPI();
  const { projectIdOrName } = useProject();

  return useQuery({
    queryKey: ['amp', 'providerApps', projectIdOrName],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error('Project ID is required');
      const api = await getAPI();
      return api.providerAppApi.listProviderApps({ projectIdOrName });
    },
    enabled: !!projectIdOrName,
  });
};

const useOauthConnectQuery = (request: OauthConnectRequest) => {
  const getAPI = useAPI();

  const operationRequest: OauthConnectOperationRequest = {
    connectOAuthParams: request,
  };

  return useQuery({
    queryKey: ['amp', 'oauthConnect', request.projectId, request.groupRef, request.consumerRef, request.provider],
    queryFn: async () => {
      if (!request.projectId) throw new Error('Project ID is required');
      if (!request?.providerAppId) throw new Error('Provider App ID is required');
      if (!request?.provider) throw new Error('Provider is required');
      if (!request?.consumerRef) throw new Error('Consumer Ref is required');
      if (!request?.groupRef) throw new Error('Group Ref is required');
      if (!request?.projectId) throw new Error('Project ID is required');
      const api = await getAPI();
      return api.oAuthApi.oauthConnect(operationRequest);
    },
    enabled: false, // do not auto-fetch
  });
};

export const useOAuthPopupURL = (
  projectId: string,
  consumerRef: string,
  groupRef: string,
  provider: string,
  workspace?: string,
  consumerName?: string,
  groupName?: string,
) => {
  const { data: provInfo, isLoading: isProvInfoLoading, error: provInfoError } = useProviderInfoQuery(provider);
  const { data: providerApps, isLoading: isProviderAppsLoading, error: providerAppsError } = useListProviderAppsQuery();

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
    data: url, error: oauthConnectError, isLoading: isOauthConnectLoading, refetch: refetchOauthConnectQuery,
  } = useOauthConnectQuery(request);

  useEffect(() => {
    if (provInfo && provider && !app) {
      console.error(`You must first set up a ${providerName} Provider App using the Ampersand Console.`);
    }
  }, [app, providerName, provInfo, provider]);

  useEffect(() => {
    if (provInfoError) {
      console.error('Error fetching provider info:', provInfoError);
      handleServerError(provInfoError);
    }
  }, [provInfoError]);

  useEffect(() => {
    if (providerAppsError) {
      console.error('Error fetching provider apps:', providerAppsError);
      handleServerError(providerAppsError);
    }
  }, [providerAppsError]);

  useEffect(() => {
    if (oauthConnectError) {
      console.error('Error fetching OAuth connect:', oauthConnectError);
      handleServerError(oauthConnectError);
    }
  }, [oauthConnectError]);

  const refetchOauthConnect = () => {
    if (provInfo?.authType === 'oauth2') {
      if (provInfo?.oauth2Opts?.grantType === 'authorizationCode'
        || provInfo?.oauth2Opts?.grantType === 'authorizationCodePKCE') {
        refetchOauthConnectQuery();
      } else {
        console.error('Provider does not support an OAuth2 web flow grant type.');
      }
    } else {
      console.error('Provider does not support an OAuth2 web flow.');
    }
  };

  return {
    url,
    error: provInfoError || providerAppsError || oauthConnectError,
    isLoading: isProvInfoLoading || isProviderAppsLoading || isOauthConnectLoading,
    refetchOauthConnect,
  };
};

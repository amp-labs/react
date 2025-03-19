import { OauthConnectRequest } from '@generated/api/src/models';
import { useQuery } from '@tanstack/react-query';

import { OauthConnectOperationRequest, useAPI } from 'services/api';

export const useOauthConnectQuery = (request: OauthConnectRequest) => {
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
      const api = await getAPI();
      return api.oAuthApi.oauthConnect(operationRequest);
    },
    enabled: false, // do not auto-fetch
  });
};

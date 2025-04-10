import { OauthUpdateRequest } from '@generated/api/src';
import { useQuery } from '@tanstack/react-query';

import { useAPI } from 'services/api';

export const useUpdateOauthConnectQuery = (request: OauthUpdateRequest) => {
  const getAPI = useAPI();

  return useQuery({
    queryKey: ['updateOauthConnection', request.projectIdOrName, request.connectionId],
    queryFn: async () => {
      const api = await getAPI();
      if (!request.projectIdOrName || !request.connectionId) {
        throw new Error('Project ID and connection ID are required');
      }
      return api.oAuthApi.oauthUpdate(request);
    },
    // only fetch if projectId and connectionId are provided
    enabled: false,
  });
};

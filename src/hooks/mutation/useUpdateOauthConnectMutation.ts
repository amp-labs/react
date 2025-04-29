import { OauthUpdateRequest } from '@generated/api/src';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAPI } from 'services/api';

export const useUpdateOauthConnectMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateOauthConnection'],
    mutationFn: async (request: OauthUpdateRequest) => {
      const api = await getAPI();
      if (!request.projectIdOrName || !request.connectionId) {
        throw new Error('Project ID and connection ID are required');
      }
      return api.oAuthApi.oauthUpdate(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};

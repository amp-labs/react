import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateInstallationOperationRequest, useAPI } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

export const useCreateInstallationMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createInstallation'],
    mutationFn: async (request: CreateInstallationOperationRequest) => {
      const api = await getAPI();
      return api.installationApi.createInstallation(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amp', 'installations'] });
    },
    onError: (error) => {
      console.error('Error creating installation');
      handleServerError(error);
    },
  });
};

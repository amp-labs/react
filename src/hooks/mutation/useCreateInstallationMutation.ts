import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateInstallationOperationRequest, useAPI } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

export const useCreateInstallationMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationKey: ['createInstallation'],
    mutationFn: async (request: CreateInstallationOperationRequest) => {
      const api = await getAPI();
      return api.installationApi.createInstallation(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amp', 'installations'] });
      setErrorMsg(null);
    },
    onError: (error) => {
      console.error('Error creating installation');
      handleServerError(error, setErrorMsg);
    },
  });

  return {
    ...mutation,
    errorMsg,
  };
};

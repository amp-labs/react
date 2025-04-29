import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateInstallationOperationRequest, useAPI } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

export const useUpdateInstallationMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationKey: ['updateInstallation'],
    mutationFn: async (request: UpdateInstallationOperationRequest) => {
      const api = await getAPI();
      return api.installationApi.updateInstallation(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amp', 'installations'] });
      setErrorMsg(null);
    },
    onError: (error) => {
      console.error('Error updating installation');
      handleServerError(error, setErrorMsg);
    },
  });

  return {
    ...mutation,
    errorMsg,
  };
};

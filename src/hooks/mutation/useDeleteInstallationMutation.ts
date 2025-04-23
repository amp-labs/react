import { useState } from 'react';
import { DeleteInstallationRequest } from '@generated/api/src';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAPI } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

export const useDeleteInstallationMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationKey: ['deleteInstallation'],
    mutationFn: async (request: DeleteInstallationRequest) => {
      const api = await getAPI();
      return api.installationApi.deleteInstallation(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amp', 'installations'] });
      setErrorMsg(null);
    },
    onError: (error) => {
      console.error('Error deleting installation');
      handleServerError(error, setErrorMsg);
    },
  });

  return {
    ...mutation,
    errorMsg,
  };
};

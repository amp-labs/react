import { useState } from 'react';
import { UpdateConnectionOperationRequest } from '@generated/api/src';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAPI } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

export const useUpdateConnectionMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationKey: ['updateConnection'],
    mutationFn: async (request: UpdateConnectionOperationRequest) => {
      const api = await getAPI();
      return api.connectionApi.updateConnection(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amp', 'connections'] });
      setErrorMsg(null);
    },
    onError: (error) => {
      console.error('Error updating connection');
      handleServerError(error, setErrorMsg);
    },
  });

  return {
    ...mutation,
    errorMsg,
  };
};

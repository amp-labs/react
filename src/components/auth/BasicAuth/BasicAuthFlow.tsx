import { useCallback } from 'react';
import { GenerateConnectionOperationRequest } from '@generated/api/src';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useProject } from 'context/ProjectContextProvider';
import { useAPI } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

import { BasicAuthContent } from './BasicAuthContent';
import { BasicAuthFlowProps } from './BasicAuthFlowProps';
import { BasicCreds } from './LandingContentProps';

export function useCreateConnectionMutation() {
  const getAPI = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createConnection'],
    mutationFn: async (params: GenerateConnectionOperationRequest) => {
      const api = await getAPI();
      return api.connectionApi.generateConnection(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amp', 'connections'] });
    },
    onError: (error) => {
      console.error('Error creating connection and loading provider info');
      handleServerError(error);
    },
  });
}

export function BasicAuthFlow({
  provider, providerInfo, consumerRef, consumerName, groupRef, groupName,
  children, selectedConnection,
}: BasicAuthFlowProps) {
  const { projectIdOrName } = useProject();
  const createConnectionMutation = useCreateConnectionMutation();

  const onNext = useCallback((form: BasicCreds) => {
    const { user, pass } = form;
    const req: GenerateConnectionOperationRequest = {
      projectIdOrName,
      generateConnectionParams: {
        groupName,
        groupRef,
        consumerName,
        consumerRef,
        provider,
        basicAuth: {
          username: user,
          password: pass,
        },
      },
    };
    createConnectionMutation.mutate(req);
  }, [projectIdOrName, groupName, groupRef, consumerName, consumerRef, provider, createConnectionMutation]);

  if (selectedConnection === null) {
    return (
      <BasicAuthContent
        provider={provider}
        providerInfo={providerInfo}
        handleSubmit={onNext}
        error={null}
      />
    );
  }

  return children;
}

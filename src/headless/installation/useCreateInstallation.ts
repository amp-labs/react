import { ConfigContent, CreateInstallationOperationRequest } from '@generated/api/src';

import { useProject } from 'src/context/ProjectContextProvider';
import { useCreateInstallationMutation } from 'src/hooks/mutation/useCreateInstallationMutation';
import { useIntegrationQuery } from 'src/hooks/query/useIntegrationQuery';

import { useInstallationProps } from '../InstallationProvider';
import { useConnection } from '../useConnection';

import { useInstallation } from './useInstallation';

export function useCreateInstallation() {
  const { projectIdOrName } = useProject();
  const { groupRef, integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
  const { connection } = useConnection();
  const { installation } = useInstallation();

  const {
    mutate: createInstallationMutation,
    isIdle,
    isPending,
    error,
    errorMsg,
  } = useCreateInstallationMutation();

  const createInstallation = (config: ConfigContent) => {
    if (installation) {
      console.error('Installation already created');
      return null;
    }
    if (!integrationObj) {
      console.error('No integration found');
      return null;
    }
    // assemble create installation requests from providers
    const createInstallationRequest: CreateInstallationOperationRequest = {
      projectIdOrName,
      integrationId: integrationObj?.id,
      installation: {
        groupRef,
        connectionId: connection?.id,
        config: { content: config },
      },
    };

    return createInstallationMutation(createInstallationRequest);
  };

  return {
    createInstallation,
    isIdle,
    isPending,
    error,
    errorMsg,
  };
}

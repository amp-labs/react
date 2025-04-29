import { ConfigContent, UpdateInstallationOperationRequest } from '@generated/api/src';
import { useProject } from 'src/context/ProjectContextProvider';
import { useUpdateInstallationMutation } from 'src/hooks/mutation/useUpdateInstallationMutation';
import { useIntegrationQuery } from 'src/hooks/query/useIntegrationQuery';

import { useInstallationProps } from '../InstallationProvider';

import { useInstallation } from './useInstallation';

/**
 * update installation hook
 * @returns
 */
export function useUpdateInstallation() {
  const { projectIdOrName } = useProject();
  const { integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
  const { installation } = useInstallation();

  const {
    mutate: updateInstallationMutation,
    isIdle,
    isPending,
    error,
    errorMsg,
  } = useUpdateInstallationMutation();

  const updateInstallation = (config: ConfigContent) => {
    if (!installation) {
      throw Error('Installation not created yet. Try creating the installation first.');
    }
    if (!integrationObj) {
      throw Error('No integration found');
    }
    // assemble update installation requests from providers
    const updateInstallationRequest: UpdateInstallationOperationRequest = {
      projectIdOrName,
      integrationId: integrationObj?.id,
      installationId: installation.id,
      installationUpdate: {
        updateMask: ['config.content'], // update entire config object
        // example read update  [`config.content.read.objects.${selectedObjectName}`],
        installation: {
          config: {
            content: config,
          },
        },
      },
    };

    return updateInstallationMutation(updateInstallationRequest);
  };

  return {
    updateInstallation,
    isIdle,
    isPending,
    error,
    errorMsg,
  };
}

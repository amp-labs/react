import {
  api,
  Config,
  HydratedRevision,
  Installation,
  UpdateInstallationOperationRequest,
  UpdateInstallationRequestInstallationConfig,
} from '../../../../services/api';
import { ConfigureState } from '../../types';
import { getIsProxyEnabled } from '../proxy/isProxyEnabled';

import {
  generateConfigWriteObjects,
} from './generateConfigWriteObjects';

/**
   * given a configureState generate the config object that is need for
   * update installation request.
   *
   * @param configureState
   * @returns
   */
const generateUpdateWriteConfigFromConfigureState = (
  configureState: ConfigureState,
  hydratedRevision: HydratedRevision,
): UpdateInstallationRequestInstallationConfig => {
  const configWriteObjects = generateConfigWriteObjects(configureState);

  // config request object type needs to be fixed
  const updateConfigObject: UpdateInstallationRequestInstallationConfig = {
    content: {
      write: {
        objects: configWriteObjects,
      },
    },
  };

  // insert proxy into config if it is enabled
  const isProxyEnabled = getIsProxyEnabled(hydratedRevision);
  if (isProxyEnabled) {
    if (!updateConfigObject.content) updateConfigObject.content = {};
    updateConfigObject.content.proxy = { enabled: true };
  }

  return updateConfigObject;
};

export const onSaveWriteUpdateInstallation = (
  projectId: string,
  integrationId: string,
  installationId: string,
  apiKey: string,
  configureState: ConfigureState,
  hydratedRevision: HydratedRevision,
  setInstallation: (installationObj: Installation) => void,
  onUpdateSuccess?: (installationId: string, config: Config) => void,
): Promise<void | null> => {
  // get configuration state
  // transform configuration state to update shape
  const updateConfig = generateUpdateWriteConfigFromConfigureState(configureState, hydratedRevision);

  if (!updateConfig) {
    console.error('Error when generating write updateConfig from configureState');
    return Promise.resolve(null);
  }

  const updateInstallationRequest: UpdateInstallationOperationRequest = {
    projectIdOrName: projectId,
    installationId,
    integrationId,
    installationUpdate: {
      // update mask will recurse to the object path and replace the object at the object path
      // this example will replace the object at the object (i.e. accounts)
      updateMask: ['config.content.write.objects'],
      installation: {
        config: updateConfig,
      },
    },
  };

  // call api.updateInstallation
  return api().installationApi.updateInstallation(updateInstallationRequest, {
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
  }).then((installation) => {
    // update local installation state
    setInstallation(installation);
    onUpdateSuccess?.(installation.id, installation.config);
  }).catch((err) => {
    console.error('ERROR: ', err);
  });
};

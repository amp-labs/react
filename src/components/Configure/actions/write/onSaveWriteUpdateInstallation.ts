import {
  api,
  Installation,
  UpdateInstallationOperationRequest,
  UpdateInstallationRequestInstallationConfig,
} from '../../../../services/api';
import { ConfigureState } from '../../types';

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

  return updateConfigObject;
};

export const onSaveWriteUpdateInstallation = (
  projectId: string,
  integrationId: string,
  installationId: string,
  apiKey: string,
  configureState: ConfigureState,
  setInstallation: (installationObj: Installation) => void,
): Promise<void | null> => {
  // get configuration state
  // transform configuration state to update shape
  const updateConfig = generateUpdateWriteConfigFromConfigureState(configureState);

  if (!updateConfig) {
    console.error('Error when generating write updateConfig from configureState');
    return Promise.resolve(null);
  }

  const updateInstallationRequest: UpdateInstallationOperationRequest = {
    projectId,
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
  }).then((data) => {
    // update local installation state
    setInstallation(data);
  }).catch((err) => {
    console.error('ERROR: ', err);
  });
};

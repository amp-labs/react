import {
  api,
  HydratedIntegrationObject,
  Installation,
  UpdateInstallationOperationRequest,
  UpdateInstallationRequestInstallationConfig,
} from '../../../services/api';
import {
  generateSelectedFieldMappingsFromConfigureState,
  generateSelectedFieldsFromConfigureState,
} from '../state/utils';
import { ConfigureState } from '../types';

/**
 * given a configureState, config, and objectName, generate the config object that is need for
 * update installation request.
 *
 * 1. get required fields from configureState
 * 2. get optional fields from configureState
 * 3. merge required fields and optional fields into selectedFields
 * 4. get required custom map fields from configureState
 * 5. generate modified config object based on update mask
 * @param configureState
 * @param config
 * @param objectName
 * @param hydratedObject
 * @param schedule
 * @returns
 */
const generateUpdateConfigFromConfigureState = (
  configureState: ConfigureState,
  objectName: string,
  hydratedObject: HydratedIntegrationObject,
  schedule: string,
): UpdateInstallationRequestInstallationConfig => {
  const selectedFields = generateSelectedFieldsFromConfigureState(configureState);
  const selectedFieldMappings = generateSelectedFieldMappingsFromConfigureState(
    configureState,
  );

  // config request object type needs to be fixed
  const updateConfigObject: UpdateInstallationRequestInstallationConfig = {
    content: {
      read: {
        standardObjects: {
          [objectName]: {
            objectName,
            // these two fields are copied from previous config, otherwise they will override null
            schedule,
            destination: hydratedObject?.destination || '',
            selectedFields,
            selectedFieldMappings,
          },
        },
      },
    },
  };

  return updateConfigObject;
};

export const onSaveUpdate = (
  projectId: string,
  integrationId: string,
  installationId: string,
  selectedObjectName: string,
  apiKey: string,
  configureState: ConfigureState,
  setInstallation: (installationObj: Installation) => void,
  hydratedObject: HydratedIntegrationObject,
) => {
  // get configuration state
  // transform configuration state to update shape
  const updateConfig = generateUpdateConfigFromConfigureState(
    configureState,
    selectedObjectName || '',
    hydratedObject,
    hydratedObject.schedule,
  );

  const updateInstallationRequest: UpdateInstallationOperationRequest = {
    projectId,
    installationId,
    integrationId,
    installationUpdate: {
      // update mask will recurse to the object path and replace the object at the object path
      // this example will replace the object at the object (i.e. accounts)
      updateMask: [`config.content.read.standardObjects.${selectedObjectName}`],
      installation: {
        config: updateConfig,
      },
    },
  };

  // call api.updateInstallation
  api().updateInstallation(updateInstallationRequest, {
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

import {
  api, CreateInstallationOperationRequest,
  CreateInstallationRequestConfig, HydratedRevision,
  Installation,
} from '../../../services/api';
import {
  generateSelectedFieldMappingsFromConfigureState,
  generateSelectedFieldsFromConfigureState,
} from '../state/utils';
import { ConfigureState } from '../types';

/**
 * gets matching object from hydratedRevision
 * @param hydratedRevision
 * @param objectName
 * @returns
 */
const getObjectFromHydratedRevision = (
  hydratedRevision: HydratedRevision,
  objectName: string,
) => {
  const readAction = hydratedRevision.content.read;
  const standardObjects = readAction?.standardObjects;
  return standardObjects?.find((obj) => obj.objectName === objectName);
};

/**
 * given a configureState, objectName, hyrdatedRevision, and consumerRef
 * generate the config object that is need for update installation request.
 *
 * 1. get required fields from configureState
 * 2. get optional fields from configureState
 * 3. merge required fields and optional fields into selectedFields
 * 4. get required custom map fields from configureState
 * 5. generate create config object
 * @param configureState
 * @param objectName
 * @param hydratedRevision
 * @param consumerRef
 * @returns
 */
const generateCreateConfigFromConfigureState = (
  configureState: ConfigureState,
  objectName: string,
  hydratedRevision: HydratedRevision,
  consumerRef: string,
): (CreateInstallationRequestConfig | null) => {
  const selectedFields = generateSelectedFieldsFromConfigureState(configureState);
  const selectedFieldMappings = generateSelectedFieldMappingsFromConfigureState(
    configureState,
  );

  const obj = getObjectFromHydratedRevision(hydratedRevision, objectName);
  if (!obj) {
    console.error(`Error when getting object from hydratedRevision for objectName: ${objectName}`);
    return null;
  }

  // create config request object
  const createConfigObj: CreateInstallationRequestConfig = {
    revisionId: hydratedRevision.id,
    createdBy: `consumer:${consumerRef}`,
    content: {
      provider: hydratedRevision.content.provider,
      read: {
        standardObjects: {
          [objectName]: {
            objectName,
            schedule: obj.schedule,
            destination: obj.destination,
            selectedFields,
            selectedFieldMappings,
          },
        },
      },
    },
  };

  return createConfigObj;
};

export const onSaveCreate = (
  projectId: string,
  integrationId: string,
  groupRef: string,
  consumerRef: string,
  connectionId: string,
  objectName: string,
  apiKey: string,
  hydratedRevision: HydratedRevision,
  configureState: ConfigureState,
  setInstallation: (installationObj: Installation) => void,
) => {
  const createConfig = generateCreateConfigFromConfigureState(
    configureState,
    objectName,
    hydratedRevision,
    consumerRef,
  );
  if (!createConfig) {
    console.error('Error when generating createConfig from configureState');
    return;
  }
  const createInstallationRequest: CreateInstallationOperationRequest = {
    projectId,
    integrationId,
    installation: {
      groupRef,
      connectionId,
      config: createConfig,
    },
  };

  api().createInstallation(createInstallationRequest, {
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
  })
    .then((installation) => {
      // update local installation state
      setInstallation(installation);
    })
    .catch((err) => {
      console.error('ERROR: ', err);
    });
};

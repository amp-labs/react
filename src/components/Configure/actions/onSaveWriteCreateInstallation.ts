import {
  api, CreateInstallationOperationRequest,
  CreateInstallationRequestConfig,
  HydratedRevision,
  Installation,
} from '../../../services/api';
import { ConfigureState } from '../types';

/**
   * gets write objects from hydratedRevision
   * @param hydratedRevision
   * @param objectName
   * @returns
   */
const getWriteObjectsFromHydratedRevision = (
  hydratedRevision: HydratedRevision,
) => {
  const writeAction = hydratedRevision.content.write;
  return writeAction?.objects;
};

type WriteObject = {
  objectName: string;
};

type WriteObjects = {
  [objectName: string]: WriteObject;
};

/**
 * example type
 * "objects":
 *  {
    objects: {
      account: {
        objectName: 'account',
      },
      contact: {
        objectName: 'contact',
      },
    },
  }
 * @param writeObjects
 * @param configureState
 * @returns
 */
const generateConfigWriteObjects = (configureState: ConfigureState) => {
  const configWriteObjects: WriteObjects = {}; // `any` is listed type in generated SDK
  const configStateWriteObjects = configureState.write?.writeObjects;
  if (configStateWriteObjects) {
    configStateWriteObjects.forEach((configStateWriteObject) => {
      const obj = configStateWriteObject.objectName;
      // object exists in config form
      if (obj) {
        // insert objectName into configWriteObjects
        configWriteObjects[obj] = {
          objectName: obj,
        };
      }
    });
  }
  return configWriteObjects;
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
const generateCreateWriteConfigFromConfigureState = (
  configureState: ConfigureState,
  hydratedRevision: HydratedRevision,
  consumerRef: string,
): (CreateInstallationRequestConfig | null) => {
  const writeObjects = getWriteObjectsFromHydratedRevision(hydratedRevision);
  if (!writeObjects) {
    console.error('Error when getting write objects from hydratedRevision');
    return null;
  }

  const configWriteObjects = generateConfigWriteObjects(configureState);

  // create config request object
  const createConfigObj: CreateInstallationRequestConfig = {
    revisionId: hydratedRevision.id,
    createdBy: `consumer:${consumerRef}`,
    content: {
      provider: hydratedRevision.content.provider,
      // need empty read.standarObjects for update read
      read: {
        standardObjects: {},
      },
      write: {
        objects: configWriteObjects,
      },
    },
  };

  return createConfigObj;
};

export const onSaveWriteCreateInstallation = (
  projectId: string,
  integrationId: string,
  groupRef: string,
  consumerRef: string,
  connectionId: string,
  apiKey: string,
  hydratedRevision: HydratedRevision,
  configureState: ConfigureState,
  setInstallation: (installationObj: Installation) => void,
): Promise<void | null> => {
  const createConfig = generateCreateWriteConfigFromConfigureState(
    configureState,
    hydratedRevision,
    consumerRef,
  );
  if (!createConfig) {
    console.error('Error when generating createConfig from configureState');
    return Promise.resolve(null);
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

  return api().installationApi.createInstallation(createInstallationRequest, {
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

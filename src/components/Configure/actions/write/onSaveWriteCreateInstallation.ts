import {
  Config,
  CreateInstallationRequestConfig,
  HydratedRevision,
  Installation,
} from '../../../../services/api';
import { createInstallationReducer } from '../../reducers/createInstallationReducer';
import { ConfigureState } from '../../types';

import { generateConfigWriteObjects } from './generateConfigWriteObjects';

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
      // need empty read.standardObjects for update read
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
  onInstallSuccess?: (installationId: string, config: Config) => void,
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

  return createInstallationReducer({
    createConfig,
    projectId,
    integrationId,
    groupRef,
    connectionId,
    apiKey,
    setInstallation,
    onInstallSuccess,
  });
};

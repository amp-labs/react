import {
  Config,
  CreateInstallationRequestConfig,
  HydratedRevision,
  Installation,
} from 'services/api';

import { ConfigureState } from '../../types';
import { createInstallationAndSetState } from '../mutateAndSetState/createInstallationAndSetState';
import { getIsProxyEnabled } from '../proxy/isProxyEnabled';

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
      // hack: need empty read.objects to be initialized for update read
      // https://linear.app/ampersand/issue/ENG-780/bug-write-createupdate-installation-without-read
      read: {
        objects: {},
      },
      write: {
        objects: configWriteObjects,
      },
    },
  };

  // insert proxy into config if it is enabled
  const isProxyEnabled = getIsProxyEnabled(hydratedRevision);
  if (isProxyEnabled) {
    createConfigObj.content.proxy = { enabled: true };
  }

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

  return createInstallationAndSetState({
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

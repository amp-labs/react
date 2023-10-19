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
 * looks through list of actions for read action type
 * assumes a single read action in list
 * @param hydratedRevision
 * @returns read action or null
 */
const getReadActionFromHydratedRevision = (hydratedRevision: HydratedRevision) => {
  const { actions } = hydratedRevision.content;
  const readAction = actions.find((action) => action.type === 'read') || null;
  return readAction;
};

/**
 * gets matching object destination from hydratedRevision
 * @param hydratedRevision
 * @param objectName
 * @returns
 */
const getDestinationFromHydratedRevision = (
  hydratedRevision: HydratedRevision,
  objectName: string,
) => {
  const readAction = getReadActionFromHydratedRevision(hydratedRevision);
  const standardObjects = readAction?.standardObjects;
  const standardObject = standardObjects?.find((obj) => obj.objectName === objectName);
  return standardObject?.destination;
};

const getScheduleFromHydratedRevision = (hydratedRevision: HydratedRevision) => {
  const readAction = getReadActionFromHydratedRevision(hydratedRevision);
  return readAction?.schedule;
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
): CreateInstallationRequestConfig => {
  const selectedFields = generateSelectedFieldsFromConfigureState(configureState);
  const selectedFieldMappings = generateSelectedFieldMappingsFromConfigureState(
    configureState,
  );

  const schedule = getScheduleFromHydratedRevision(hydratedRevision);
  const destination = getDestinationFromHydratedRevision(hydratedRevision, objectName);

  // create config request object
  const createConfigObj: CreateInstallationRequestConfig = {
    revisionId: hydratedRevision.id,
    createdBy: `consumer:${consumerRef}`,
    content: {
      api: hydratedRevision.content.api,
      read: {
        standardObjects: {
          [objectName]: {
            objectName,
            schedule,
            destination,
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

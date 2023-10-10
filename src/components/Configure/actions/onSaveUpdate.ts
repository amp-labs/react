import { api, Config, UpdateInstallationRequestInstallationConfig } from '../../../services/api';
import { ConfigureState } from '../types';
import { getFieldKeyValue } from '../utils';
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
 * @returns
 */
const generateUpdateConfigFromConfigureState = (
  configureState: ConfigureState,
  config: Config,
  objectName: string,
): UpdateInstallationRequestInstallationConfig => {
  const {
    requiredFields, optionalFields, requiredCustomMapFields,
  } = configureState;

  const fields = new Set<string>();
  requiredFields?.forEach((field) => fields.add(getFieldKeyValue(field)));
  // adds optional fields that are selected (true)
  optionalFields?.forEach((field) => field.value && fields.add(getFieldKeyValue(field)));
  // convert set to object for config
  const selectedFields = Array.from(fields).reduce((acc, field) => ({
    ...acc,
    [field]: true,
  }), {});

  const requiredCustomMapFieldsConfig = (requiredCustomMapFields || []).reduce((acc, field) => {
    const key = getFieldKeyValue(field);
    return {
      ...acc,
      [key]: field.value,
    };
  }, {});

  // config request object type needs to be fixed
  const updateConfigObject: UpdateInstallationRequestInstallationConfig = {
    content: {
      read: {
        standardObjects: {
          [objectName]: {
            objectName,
            // these two fields are copied from previous config, otherwise they will override null
            schedule: config?.content?.read?.standardObjects?.[objectName].schedule || '',
            destination: config?.content?.read?.standardObjects?.[objectName].destination || '',
            selectedFields,
            selectedFieldMappings: requiredCustomMapFieldsConfig,
          },
        },
      },
    },
  };

  return updateConfigObject;
};

export const onSaveUpdate = (
  projectId: string,
  configureState: ConfigureState,
  config: Config,
  selectedObjectName: string,
  installationId: string,
  integrationId:string,
  apiKey:string | null,
) => {
  // get configuration state
  // transform configuration state to update shape
  const newConfig = generateUpdateConfigFromConfigureState(
    configureState,
    config,
    selectedObjectName || '',
  );

  // call api.updateInstallation
  api().updateInstallation({
    projectId,
    installationId,
    integrationId,
    installationUpdate: {
      // update mask will recurse to the object path and replace the object at the object path
      // this example will replace the object at the object (i.e. accounts)
      updateMask: [`config.content.read.standardObjects.${selectedObjectName}`],
      installation: {
        config: newConfig,
      },
    },
  }, {
    headers: {
      'X-Api-Key': apiKey ?? '',
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    console.log('UPDATED INSTALLATION: ', data);
  }).catch((err) => {
    console.error('ERROR: ', err);
  });
};

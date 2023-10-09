import { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Checkbox, Select, Stack, Tag, Text,
} from '@chakra-ui/react';

import { ApiKeyContext } from '../../context/ApiKeyContext';
import { useHydratedRevision } from '../../context/HydratedRevisionContext';
import { useProject } from '../../context/ProjectContext';
import {
  api,
  Config,
  HydratedIntegrationAction,
  HydratedIntegrationFieldExistent,
  HydratedRevision,
  Installation, Integration,
  UpdateInstallationRequestInstallationConfig,
} from '../../services/api';

import { OptionalFields } from './fields/OptionalFields';
import { RequiredCustomFields } from './fields/RequiredCustomFields';
import { RequiredFields } from './fields/RequiredFields';
import { content } from './content';
import { ObjectManagementNav, useSelectedObjectName } from './ObjectManagementNav';
import { ConfigureState, ConfigureStateIntegrationField, CustomConfigureStateIntegrationField } from './types';
import {
  getActionTypeFromActions, getFieldKeyValue, getOptionalFieldsFromObject,
  getRequiredCustomMapFieldsFromObject,
  getRequiredFieldsFromObject, getStandardObjectFromAction,
  getValueFromConfigCustomMapping, getValueFromConfigExist,
  PLACEHOLDER_VARS,
} from './utils';

interface ReconfigureIntegrationProps {
  installation: Installation,
  integrationObj: Integration,
}

function getConfigurationState(
  actions: HydratedIntegrationAction[],
  type: string,
  objectName: string,
  config: any,
): ConfigureState {
  const action = getActionTypeFromActions(actions, type);
  const object = action && getStandardObjectFromAction(action, objectName);

  const requiredFields = object && getRequiredFieldsFromObject(object);
  const optionalFields = object
    ? getOptionalFieldsFromObject(object)?.map((field) => ({
      ...field,
      value: getValueFromConfigExist(
        config,
        objectName,
        // should only use fieldName for existant fields
        getFieldKeyValue(field),
      ),
    })) as ConfigureStateIntegrationField[] : null; // type hack - TODO fix

  // todo map over requiredCustomMapFields and get value from config
  const requiredCustomMapFields = object ? getRequiredCustomMapFieldsFromObject(object)
    ?.map((field) => ({
      ...field,
      value: getValueFromConfigCustomMapping(
        config,
        objectName,
        // should only use mapToName for custom mapping fields
        getFieldKeyValue(field),
      ),
    })) as CustomConfigureStateIntegrationField[] : null; // type hack - TODO fix

  const allFields = object?.allFields as HydratedIntegrationFieldExistent[] || [];

  return {
    allFields,
    requiredFields,
    optionalFields,
    requiredCustomMapFields,
  };
}

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
const generateConfigFromConfigureState = (
  configureState: ConfigureState,
  config: Config,
  objectName: string,
): UpdateInstallationRequestInstallationConfig => {
  const {
    requiredFields, optionalFields, requiredCustomMapFields,
  } = configureState;

  const fields = new Set<string>();
  requiredFields?.forEach((field) => fields.add(getFieldKeyValue(field)));
  optionalFields?.forEach((field) => fields.add(getFieldKeyValue(field)));
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

const resetConfigurationState = (
  hydratedRevision: HydratedRevision,
  config: Config,
  selectedObjectName: string,
  setConfigureState: React.Dispatch<React.SetStateAction<ConfigureState>>,
) => {
  const hydratedActions = hydratedRevision?.content.actions || []; // read / write / etc...
  const state = getConfigurationState(
    hydratedActions,
    PLACEHOLDER_VARS.OPERATION_TYPE,
    selectedObjectName,
    config,
  );
  setConfigureState(state);
};

const initialConfigureState: ConfigureState = {
  allFields: null,
  requiredFields: null,
  optionalFields: null,
  requiredCustomMapFields: null,
};

//  Update Installation Flow
function ReconfigureIntegrationContent(
  { installation, integrationObj }: ReconfigureIntegrationProps,
) {
  const { hydratedRevision, loading, error } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  const apiKey = useContext(ApiKeyContext);
  const { project, projectId } = useProject();
  const appName = project?.appName || '';

  const { config } = installation;

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision from installation revisionId (contains full form)
  // 3. generate the configuration state from the hydrated revision and config
  const [configureState, setConfigureState] = useState<ConfigureState>(initialConfigureState);

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    if (hydratedRevision?.content?.actions && !loading && selectedObjectName) {
      resetConfigurationState(hydratedRevision, config, selectedObjectName, setConfigureState);
    }
  }, [hydratedRevision, loading, selectedObjectName, config]);

  const onSave = () => {
    // get configuration state
    // transform configuration state to update shape
    const newConfig = generateConfigFromConfigureState(
      configureState,
      config,
      selectedObjectName || '',
    );

    // call api.updateInstallation
    api().updateInstallation({
      projectId,
      installationId: installation.id,
      integrationId: integrationObj.id,
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

  const onCancel = () => {
    // revert configurationState when canceled
    if (hydratedRevision?.content?.actions && !loading && selectedObjectName) {
      resetConfigurationState(hydratedRevision, config, selectedObjectName, setConfigureState);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={4} marginBottom="20px" flexDir="row-reverse">
        <Button backgroundColor="gray.800" _hover={{ backgroundColor: 'gray.600' }} onClick={onSave}>Save</Button>
        <Button
          backgroundColor="gray.200"
          color="blackAlpha.700"
          _hover={{ backgroundColor: 'gray.300' }}
          onClick={onCancel}
        >Cancel
        </Button>
      </Stack>
      <Box
        p={8}
        width="600px"
        minWidth="600px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        textAlign={['left']}
        margin="auto"
        bgColor="white"
      >
        <Text marginBottom="20px">
          {content.reconfigureIntro(
            appName,
            integrationObj.provider,
            PLACEHOLDER_VARS.PROVIDER_WORKSPACE_REF,
          )}
        </Text>
        {error && <div>{error}</div>}
        {loading && <div>Loading...</div>}
        {hydratedRevision && selectedObjectName && (
        <>
          <RequiredFields configureState={configureState} />
          <OptionalFields configureState={configureState} setConfigureState={setConfigureState} />
          <RequiredCustomFields
            configureState={configureState}
            setConfigureState={setConfigureState}
          />
        </>
        )}
      </Box>
    </Box>
  );
}

export function ReconfigureIntegration(
  { installation, integrationObj }: ReconfigureIntegrationProps,
) {
  return (
    <ObjectManagementNav config={installation?.config}>
      <ReconfigureIntegrationContent installation={installation} integrationObj={integrationObj} />
    </ObjectManagementNav>
  );
}

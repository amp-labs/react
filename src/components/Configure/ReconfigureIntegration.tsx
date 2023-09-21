import { useEffect, useState } from 'react';
import {
  Box, Checkbox, Select, Stack, Tag, Text,
} from '@chakra-ui/react';

import { useHydratedRevision } from '../../context/HydratedRevisionContext';
import { useProject } from '../../context/ProjectContext';
import {
  Config, HydratedIntegrationAction, HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  Installation, Integration,
  IntegrationFieldMapping,
} from '../../services/api';
import { capitalize } from '../../utils';

import { ObjectManagementNav, useSelectedObjectName } from './ObjectManagementNav';
import {
  getActionTypeFromActions, getFieldKeyValue, getOptionalFieldsFromObject,
  getRequiredCustomMapFieldsFromObject,
  getRequiredFieldsFromObject, getStandardObjectFromAction,
  getValueFromConfigCustomMapping, getValueFromConfigExist,
  isIntegrationFieldMapping,
  PLACEHOLDER_VARS,
} from './utils';

interface ReconfigureIntegrationProps {
  installation: Installation,
  integrationObj: Integration,
}

const dummyConfig2: Config = {
  id: 'dummyConfig2',
  revisionId: 'revisionId',
  createTime: new Date(),
  createdBy: 'createdBy',
  content: {
    api: 'salesforce',
    read: {
      schedule: '*/15 * * * *',
      objects: {
        account: {
          objectName: 'account',
          destination: 'accountWebhook',
          selectedFields: {
            name: true,
            phone: true,
          },
          selectedFieldMappings: {
            accountId: 'id',
          },
        },
        contact: {
          objectName: 'contact',
          destination: 'contactWebhook',
          selectedFields: {
            fax: true,
            name: true,
          },
          selectedFieldMappings: {
            userId: 'Email',
            accountId: 'AccountId',
          },
        },
      },
    },
  },
};

const content = {
  reconfigureIntro: (
    appName: string,
    apiProvider: string,
    workspace: string,
  ) => (
    // eslint-disable-next-line max-len
    <>{capitalize(apiProvider)} integration: <b>{workspace}</b>.</>
  ),
  reconfigureRequiredFields: (
    appName: string,
    objectName: string,
  ) => <>{appName} reads the following <b>{objectName}</b> fields</>,
  customMappingText: (
    objectName: string,
    customField: string,
    // eslint-disable-next-line max-len
  ) => <>Which of your custom fields from <b>{objectName}</b> should be mapped to <b>{customField}</b>?</>,
};

type ConfigureStateIntegrationField = HydratedIntegrationFieldExistent & {
  value: string | number | boolean | null,
};

type CustomConfigureStateIntegrationField = IntegrationFieldMapping & {
  value: string | number | undefined,
};

type ConfigureState = {
  allFields: HydratedIntegrationFieldExistent[] | null, // needed for custom mapping
  requiredFields: HydratedIntegrationField[] | null,
  optionalFields: ConfigureStateIntegrationField[] | null,
  requiredCustomMapFields: CustomConfigureStateIntegrationField[] | null,
};

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

  const { project } = useProject();
  const appName = project?.appName || '';

  // TODO: update config structure, currently using dummyConfig2 [ENG-251]
  const { config } = installation;

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision from installation revisionId (contains full form)
  // 3. generate the configuration state from the hydrated revision and config
  const [configureState, setConfigureState] = useState<ConfigureState>(initialConfigureState);
  console.log('config: ', { config, dummyConfig2, configureState });

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    if (hydratedRevision?.content?.actions && !loading && selectedObjectName) {
      const hydratedActions = hydratedRevision?.content.actions || []; // read / write / etc...
      const state = getConfigurationState(
        hydratedActions,
        PLACEHOLDER_VARS.OPERATION_TYPE,
        selectedObjectName,
        dummyConfig2,
      );
      setConfigureState(state);
    }
  }, [hydratedRevision?.content?.actions, loading, selectedObjectName]);

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const { optionalFields } = configureState;
    const optionalFieldToUpdate = optionalFields?.find((field) => field.fieldName === name);

    if (optionalFieldToUpdate) {
      // Update the value property to new checked value
      optionalFieldToUpdate.value = checked;

      // update state
      setConfigureState({ ...configureState, optionalFields: [...optionalFields || []] });
    }
  };

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    const { requiredCustomMapFields } = configureState;
    const requiredCustomMapFieldtoUpdate = requiredCustomMapFields?.find(
      (field) => field.mapToName === name,
    );

    if (requiredCustomMapFieldtoUpdate) {
      // Update the custome field value property to new value
      requiredCustomMapFieldtoUpdate.value = value;
      const newState = {
        ...configureState,
        requiredCustomMapFields: [...requiredCustomMapFields || []],
      };

      // update state
      setConfigureState(newState);
    }
  };

  return (
    <Box
      p={8}
      width="600px"
      minWidth="600px"
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
      textAlign={['left']}
      margin="auto"
      marginTop="40px"
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
          <Text marginBottom="5px">
            {content.reconfigureRequiredFields(appName, selectedObjectName)}
          </Text>
          <Box marginBottom="20px">
            {configureState.requiredFields?.map((field) => {
              if (!isIntegrationFieldMapping(field)) {
                return <Tag key={field.fieldName}>{field.displayName}</Tag>;
              }
              return null; // fallback for customed mapped fields
            })}
          </Box>
          <Text marginBottom="5px">Optional Fields</Text>
          <Stack marginBottom="20px">
            {configureState.optionalFields?.map((field) => {
              if (!isIntegrationFieldMapping(field)) {
                return (
                  <Box key={field.fieldName} display="flex" gap="5px" borderBottom="1px" borderColor="gray.100">
                    <Checkbox
                      name={field.fieldName}
                      id={field.fieldName}
                      isChecked={!!field.value}
                      onChange={onCheckboxChange}
                    >
                      {field.displayName}
                    </Checkbox>
                  </Box>
                );
              }
              return null; // fallback for customed mapped fields
            })}
          </Stack>

          <Stack>
            {configureState.requiredCustomMapFields?.map((field) => {
              if (isIntegrationFieldMapping(field)) {
                return (
                  <Stack key={field.mapToName}>
                    <Text marginBottom="5px">
                      {content.customMappingText(selectedObjectName, field.mapToName)}
                    </Text>
                    <Select
                      name={field.mapToName}
                      variant="flushed"
                      value={field.value}
                      onChange={onSelectChange}
                      placeholder="Please select one"
                    >
                      {configureState?.allFields?.map((f) => (
                        <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>
                      ))}
                    </Select>
                  </Stack>
                );
              }
              return null; // fallback for existant fields
            })}
          </Stack>
        </>
      )}
    </Box>
  );
}

export function ReconfigureIntegration(
  { installation, integrationObj }: ReconfigureIntegrationProps,
) {
  return (
    <ObjectManagementNav config={dummyConfig2}>
      <ReconfigureIntegrationContent installation={installation} integrationObj={integrationObj} />
    </ObjectManagementNav>
  );
}

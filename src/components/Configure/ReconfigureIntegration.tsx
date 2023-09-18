import { useEffect, useState } from 'react';
import {
  Box, Checkbox, Select, Stack, Tag, Text,
} from '@chakra-ui/react';

import { useProjectID } from '../../hooks/useProjectID';
import {
  api, Config, HydratedIntegrationAction, HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationObject,
  Installation, Integration,
  IntegrationFieldMapping,
} from '../../services/api';
import { capitalize } from '../../utils';

interface ReconfigureIntegrationProps {
  installation: Installation,
  integrationObj: Integration,
}

const dummyConfig2 : Config = {
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

/**
 * TODO move to utils - kept here until config update is complete.
 */

/**
 * type guard for IntegrationFieldMapping | IntegrationFieldExistent
 *
 * @param field HydratedIntegrationField
 * @returns
 */
function isIntegrationFieldMapping(field: HydratedIntegrationField):
field is IntegrationFieldMapping {
  return (field as IntegrationFieldMapping).mapToName !== undefined;
}

// 1. get action type
/**
 *
 * @param actions HydratedIntegrationAction[]
 * @param type read / write / etc...
 * @returns HydratedIntegrationAction | null
 */
function getActionTypeFromActions(actions: HydratedIntegrationAction[], type: string)
  : HydratedIntegrationAction | null {
  return actions.find((action) => action.type === type) || null;
}
// 2. get standard object
/**
 *
 * @param action HydratedIntegrationAction
 * @param objectName string (account, contect, etc...)
 * @returns HydratedIntegrationObject | null
 */
function getStandardObjectFromAction(action: HydratedIntegrationAction, objectName: string)
  : HydratedIntegrationObject | null {
  return action?.standardObjects?.find((object) => object.objectName === objectName) || null;
}

// 3a. get required fields
function getRequiredFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.requiredFields?.filter(
    (rf: HydratedIntegrationField) => !isIntegrationFieldMapping(rf) && !!rf.fieldName,
  ) || null;
}

// 3b. get required custom mapping fields
function getRequiredCustomMapFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.requiredFields?.filter(
    (rf: HydratedIntegrationField) => isIntegrationFieldMapping(rf) && !!rf.mapToName,
  ) || null;
}

// 4. get optional fields
function getOptionalFieldsFromObject(object: HydratedIntegrationObject)
  : HydratedIntegrationField[] | null {
  return object?.optionalFields || null;
}

const getReadObject = (
  config: Config,
  objectName:string,
) => config?.content?.read?.objects[objectName];

// 5. get value for field
function getValueFromConfigExist(config: Config, objectName: string, key: string): boolean {
  const object = getReadObject(config, objectName);
  return object?.selectedFields?.[key] || false;
}

// 5b. get value for custom mapping field
function getValueFromConfigCustomMapping(config: Config, objectName: string, key: string) : string {
  const object = getReadObject(config, objectName);
  return object?.selectedFieldMappings?.[key] || '';
}

// aux. get field value based on type guard
function getFieldKeyValue(field: HydratedIntegrationField): string {
  if (isIntegrationFieldMapping(field)) {
    return field.mapToName; // custom mapping
  }
  return field.fieldName; // existant field
}

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

// TODO - add support for fetching these dynamically
const providerWorkspaceRef = 'my-instance'; // get this from installation.connection
const appName = 'my-app'; // get this from getProject
const objectName = 'account';
const OPERATION_TYPE = 'read'; // only one supported for mvp

const initialConfigureState: ConfigureState = {
  allFields: null,
  requiredFields: null,
  optionalFields: null,
  requiredCustomMapFields: null,
};

//  Update Installation Flow
export function ReconfigureIntegration(
  { installation, integrationObj }: ReconfigureIntegrationProps,
) {
  const [loading, setLoading] = useState(false);
  const projectID = useProjectID();

  // TODO: update config structure, currently using dummyConfig2 [ENG-251]
  const { config } = installation;

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision from installation revisionId (contains full form)
  // 3. generate the configuration state from the hydrated revision and config
  const [configureState, setConfigureState] = useState<ConfigureState>(initialConfigureState);
  console.log('config: ', { config, configureState });

  useEffect(() => {
    if (projectID && integrationObj && installation) {
      setLoading(true);
      api.getHydratedRevision(
        {
          projectId: projectID,
          integrationId: integrationObj.id,
          revisionId: integrationObj.latestRevision.id, // revisionId from integration
          connectionId: installation.connectionId, // connectionId from installation
        },
      ).then((_hydratedRevision) => {
        const hydratedActions = _hydratedRevision?.content.actions || []; // read / write / etc...
        const state = getConfigurationState(
          hydratedActions,
          OPERATION_TYPE,
          objectName,
          dummyConfig2,
        );
        setConfigureState(state);
        setLoading(false);
      }).catch((err) => {
        console.error('ERROR: ', err);
      });
    }
  }, [projectID, integrationObj.id, installation.connectionId, integrationObj.latestRevision.id]);

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
      maxWidth="600px"
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
      textAlign={['left']}
      margin="auto"
      marginTop="40px"
      bgColor="white"
    >
      <Text marginBottom="20px">
        {content.reconfigureIntro(appName, integrationObj.provider, providerWorkspaceRef)}
      </Text>
      {loading ? <div>Loading...</div>
        : (
          <>
            <Text marginBottom="5px">
              {content.reconfigureRequiredFields(appName, objectName)}
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
                    <>
                      <Text marginBottom="5px">
                        {content.customMappingText(objectName, field.mapToName)}
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
                    </>
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

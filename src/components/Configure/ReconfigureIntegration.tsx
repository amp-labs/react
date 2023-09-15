import { useEffect, useState } from 'react';

import { useProjectID } from '../../hooks/useProjectID';
import {
  api, Config, HydratedIntegrationAction, HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationObject,
  Installation, Integration,
  IntegrationFieldMapping,
} from '../../services/api';

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
            accountId: 'Id',
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

type ConfigureState = {
  requiredFields: HydratedIntegrationField[] | null,
  optionalFields: ConfigureStateIntegrationField[] | null,
  requiredCustomMapFields: ConfigureStateIntegrationField[] | null,
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
    })) as ConfigureStateIntegrationField[] : null; // type hack - TODO fix

  return {
    requiredFields,
    optionalFields,
    requiredCustomMapFields,
  };
}

const initialConfigureState: ConfigureState = {
  requiredFields: null,
  optionalFields: null,
  requiredCustomMapFields: null,
};

//  Update Installation Flow
export function ReconfigureIntegration(
  { installation, integrationObj }: ReconfigureIntegrationProps,
) {
  const projectID = useProjectID();
  const { config } = installation; // TODO: update config structure, currently using dummyConfig2

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision from installation revisionId (contains full form)
  // 3. generate the configuration state from the hydrated revision and config
  const [configureState, setConfigureState] = useState<ConfigureState>(initialConfigureState);

  useEffect(() => {
    if (projectID && integrationObj && installation) {
      api.getHydratedRevision(
        {
          projectId: projectID,
          integrationId: integrationObj.id,
          revisionId: integrationObj.latestRevision.id, // revisionId from integration
          connectionId: installation.connectionId, // connectionId from installation
        },
      ).then((_hydratedRevision) => {
        const hydratedActions = _hydratedRevision?.content.actions || []; // read / write / etc...
        const state = getConfigurationState(hydratedActions, 'read', 'account', dummyConfig2);
        setConfigureState(state);
      }).catch((err) => {
        console.error('ERROR: ', err);
      });
    }
  }, [projectID, integrationObj.id, installation.connectionId, integrationObj.latestRevision.id]);

  return (
    <div>
      <div>Update Configuration Flow</div>
      <div>Required</div>
      <p>
        {configureState.requiredFields?.map((field) => {
          if (!isIntegrationFieldMapping(field)) {
            return <li key={field.fieldName}>{field.displayName}</li>;
          }
          return null; // fallback for customed mapped fields
        })}
      </p>
      <div>Optional</div>
      <p>
        {configureState.optionalFields?.map((field) => {
          if (!isIntegrationFieldMapping(field)) {
            return <li key={field.fieldName}>{`${field.displayName} - ${field.value}`}</li>;
          }
          return null; // fallback for customed mapped fields
        })}
      </p>
      <div>Custom Mapping</div>
      <p>
        {configureState.requiredCustomMapFields?.map((field) => {
          if (isIntegrationFieldMapping(field)) {
            return <li key={field.mapToName}>{`${field.mapToName} - ${field.value}`}</li>;
          }
          return null; // fallback for existant fields
        })}
      </p>
    </div>
  );
}

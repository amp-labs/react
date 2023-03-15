import React, {
  FormEvent, useContext, useEffect, useState,
} from 'react';
import {
  map, capitalize,
} from 'lodash';
import {
  Switch, FormControl, FormLabel, Button, Box, UnorderedList, ListItem, Select, Text, SimpleGrid,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  DataField,
  FieldMappingOption,
  IntegrationConfig,
  IntegrationSource,
  ObjectConfigOptions,
  OptionalDataField,
  SourceList,
} from '../types/configTypes';
import {
  getUserConfig,
  postUserConfig,
} from '../../library/services/apiService';
import CenteredTextBox from '../CenteredTextBox';
import { findObjectInIntegrationConfig, findSourceFromList, getDefaultConfigForSource } from '../../utils';
import { SourceListContext, SubdomainContext } from '../AmpersandProvider/AmpersandProvider';

interface InstallIntegrationProps {
  integration: string,
  api: string,
}

const STRINGS = {
  CONFIGURE_INTRO: (
    appName: string,
    api: string,
    subdomain: string,
  ) => <>Let's integrate {appName} with your {capitalize(api)} instance <b>{subdomain}</b>.</>,
  RECONFIGURE_INTRO: (
    appName: string,
    api: string,
    subdomain: string,
  ) => (
    <>
      Let's update {appName}'s integration with your {capitalize(api)} instance <b>{subdomain}</b>.
    </>
  ),
  CONFIGURE_REQUIRED_FIELDS: (
    appName: string,
    object: ObjectConfigOptions,
  ) => {
    const { name } = object;
    return <>{appName} will read the following <b>{name.displayName}</b> fields:</>;
  },
  RECONFIGURE_REQUIRED_FIELDS: (
    appName: string,
    object: ObjectConfigOptions,
  ) => {
    const { name } = object;
    return <>{appName} is reading the following <b>{name.displayName}</b> fields:</>;
  },
};

export function InstallIntegration(
  { integration, api }: InstallIntegrationProps,
) {
  const sourceList: SourceList | null = useContext(SourceListContext);
  const { subdomain } = useContext(SubdomainContext);
  let source;

  if (sourceList) {
    source = findSourceFromList(integration, sourceList);
  }

  if (!source || !subdomain) {
    return <CenteredTextBox text="There is an error" />;
  }

  return (
    <ConfigureIntegration
      source={source}
      api={api}
      subdomain={subdomain}
    />
  );
}

export function ReconfigureIntegration(
  { integration, api }: InstallIntegrationProps,
) {
  const sourceList: SourceList | null = useContext(SourceListContext);
  const { subdomain } = useContext(SubdomainContext);
  const [source, setSource] = useState<IntegrationSource | null>(null);
  const [userConfig, setUserConfig] = useState<IntegrationConfig | undefined>(undefined);

  // GET USER'S EXISTING CONFIG IF EXISTING
  useEffect(() => {
    if (sourceList) {
      const source = findSourceFromList(integration, sourceList);
      if (source) {
        setSource(source);
        setUserConfig(getUserConfig(source, subdomain, api));
      }
    }
  }, [sourceList]);

  // debugger;
  if (!source || !subdomain || !userConfig) {
    return <CenteredTextBox text="There is an error" />;
  }

  return (
    <ConfigureIntegration
      source={source}
      api={api}
      subdomain={subdomain}
      userConfig={userConfig}
    />
  );
}

interface ConfigureIntegrationProps {
  source: IntegrationSource;
  subdomain: string;
  api: string,
  userConfig?: IntegrationConfig,
}

function ConfigureIntegration({
  source, subdomain, api, userConfig = undefined,
}: ConfigureIntegrationProps) {
  const { type } = source;
  if (type === 'read') {
    return (
      <SetUpRead
        source={source}
        subdomain={subdomain}
        userConfig={userConfig}
        api={api}
      />
    );
  } if (type === 'write') {
    return <SetUpWrite />;
  }
  return null;
}

function SetUpRead({
  source, subdomain, api, userConfig = undefined,
}: ConfigureIntegrationProps) {
  let config: IntegrationConfig;
  if (!userConfig) {
    config = getDefaultConfigForSource(source.objects);
  } else {
    config = userConfig;
  }

  const [integrationConfig, setIntegrationConfig] = useState(config);
  const navigate = useNavigate();

  const appName = 'MailMonkey'; // TODO: should read from source.
  const { objects } = source;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    /* eslint-disable-next-line no-console */
    console.log('submitted');
    postUserConfig(integrationConfig);

    navigate('/configure-write');
  };

  const elems = map(objects, (object: ObjectConfigOptions) => {
    let mandatoryFields;
    let optionalFields;
    let customFieldMapping;

    if (object.requiredFields) {
      let configureString = STRINGS.CONFIGURE_REQUIRED_FIELDS(appName, object);
      if (userConfig) {
        configureString = STRINGS.RECONFIGURE_REQUIRED_FIELDS(appName, object);
      }

      mandatoryFields = (
        <>
          <Text marginBottom="10px">
            {configureString}
          </Text>
          <FormControl>
            {map(object.requiredFields, (field) => (
              <Box key={field.fieldName} as={SimpleGrid} columns={{ base: 2, lg: 2 }}>
                <FormLabel htmlFor={field.fieldName} margin="0" paddingRight="20px">
                  {field.displayName}
                </FormLabel>
                <Switch id={field.fieldName} defaultChecked isDisabled />
              </Box>
            ))}
          </FormControl>
          <br />
        </>
      );
    }

    if (object.optionalFields) {
      // GET USER'S CONFIG SETTINGS, IF THEY EXIST
      const userObject = findObjectInIntegrationConfig(object, integrationConfig);
      const userOptionalFieldConfig = userObject?.selectedOptionalFields;

      optionalFields = (
        <>
          <FormControl>
            <Text color="gray.600" marginBottom="5px">Optional fields:</Text>
            {map(object.optionalFields, (field: OptionalDataField) => (
              <Box key={field.fieldName} as={SimpleGrid} columns={{ base: 2, lg: 2 }}>
                <FormLabel htmlFor={field.fieldName} margin="0" paddingRight="20px">
                  { field.displayName }
                </FormLabel>
                <Switch
                  id={field.fieldName}
                  defaultChecked={
                    userOptionalFieldConfig?.[field.fieldName]
                    || field.isDefaultSelected
                  }
                  onChange={(e) => {
                    const selectedObject = findObjectInIntegrationConfig(object, integrationConfig);
                    if (selectedObject) {
                      selectedObject.selectedOptionalFields[field.fieldName] = e.target.checked;
                    }

                    setIntegrationConfig(integrationConfig);
                  }}
                />
              </Box>
            ))}
          </FormControl>
          <br />
        </>
      );
    }

    if (object.customFieldMapping) {
      // GET USER'S CONFIG SETTINGS, IF THEY EXIST
      const userObject = findObjectInIntegrationConfig(object, integrationConfig);
      const userSelectedFieldMapping = userObject?.selectedFieldMapping;

      customFieldMapping = (
        <>
          {map(object.customFieldMapping, (mapping: FieldMappingOption) => (
            <div key={mapping.mapToName}>
              <Text marginBottom="10px">
                Which of your custom fields from <b>{object.name.displayName}</b> should be mapped
                to <b>{mapping.mapToDisplayName}</b>?
              </Text>
              <Text color="gray.600" marginBottom="10px">{mapping.prompt}</Text>
              <Select
                placeholder="Select custom field"
                onChange={(e) => {
                  const selectedObject = findObjectInIntegrationConfig(object, integrationConfig);

                  if (selectedObject?.selectedFieldMapping) {
                    selectedObject.selectedFieldMapping[mapping.mapToName] = e.target.value;
                  }

                  setIntegrationConfig(integrationConfig);
                }}
              >
                {map(mapping.choices, (choice: DataField) => (
                  <option
                    value={choice.fieldName}
                    key={choice.fieldName}
                    selected={choice.fieldName === userSelectedFieldMapping?.[mapping.mapToName]}
                  >
                    {choice.displayName}
                  </option>
                ))}
              </Select>
            </div>
          ))}
          <br />
        </>
      );
    }

    return (
      <Box key={object.name.objectName} marginTop="20px" marginBottom="10px">
        {mandatoryFields}
        {optionalFields}
        {customFieldMapping}
      </Box>
    );
  });

  let IntroString = STRINGS.CONFIGURE_INTRO(appName, api, subdomain);

  if (userConfig) {
    IntroString = STRINGS.RECONFIGURE_INTRO(appName, api, subdomain);
  }

  return (
    <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin="auto" marginTop="40px" bgColor="white">
      <Text marginBottom="20px">
        {IntroString}
      </Text>
      <hr />
      <form onSubmit={handleSubmit}>
        {elems}
        <Button type="submit">Next</Button>
      </form>
    </Box>
  );
}

function SetUpWrite(/* props: InstallProps */) {
  return (<>TODO</>);
}

export function SetUpWriteTemp() {
  const navigate = useNavigate();
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    /* eslint-disable-next-line no-console */
    console.log('submitted');
    navigate('/data');
  };
  const prompt = 'Every time we send out an email, we will record it as an Email within Salesforce.';
  const objectDisplayName = 'Email';
  const appName = 'MailMonkey';
  const api = 'Salesforce';
  const elems = (
    <Box marginTop="20px" marginBottom="10px">
      <Text marginBottom="10px">
        {appName} will save <b>{objectDisplayName}s</b> to {api}.
      </Text>
      <Text color="gray.600" marginBottom="10px">{prompt}</Text>
      <Text marginBottom="10px">
        Each {objectDisplayName} will include the following fields:
      </Text>
      <UnorderedList>
        <ListItem>Subject</ListItem>
        <ListItem>Status</ListItem>
        <ListItem>Contact ID</ListItem>
        <ListItem>Description</ListItem>
      </UnorderedList>
      <br />
    </Box>
  );

  return (
    <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin="auto" marginTop="40px" bgColor="white">
      <Text marginBottom="20px">
        Let's integrate MailMonkey with your Salesforce instance
        <b>boxit2-dev-ed</b>
        .
      </Text>
      <hr />
      <form onSubmit={handleSubmit}>
        {elems}
        <Button type="submit">Install</Button>
      </form>
    </Box>
  );
}

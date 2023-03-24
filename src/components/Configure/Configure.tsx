import React, {
  FormEvent, useContext, useEffect, useState,
} from 'react';
import {
  capitalize, map, merge,
} from 'lodash';
import {
  Switch, FormControl, FormLabel, Button, Box, Select, Text, SimpleGrid,
} from '@chakra-ui/react';
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
import {
  findObjectInIntegrationConfig, findSourceFromList, getDefaultConfigForSource, redirectTo,
} from '../../utils';
import { SourceListContext, SubdomainContext } from '../AmpersandProvider/AmpersandProvider';

interface InstallIntegrationProps {
  integration: string,
  api: string,
  redirectUrl?: string,
}

const strings = {
  configureIntro: (
    appName: string,
    api: string,
    subdomain: string,
  ) => <>Let's integrate {appName} with your {capitalize(api)} instance <b>{subdomain}</b>.</>,
  reconfigureIntro: (
    appName: string,
    api: string,
    subdomain: string,
  ) => (
    <>
      Let's update {appName}'s integration with your {capitalize(api)} instance <b>{subdomain}</b>.
    </>
  ),
  configureRequiredFields: (
    appName: string,
    object: ObjectConfigOptions,
  ) => {
    const { name } = object;
    return <>{appName} will read the following <b>{name.displayName}</b> fields:</>;
  },
  reconfigureRequiredFields: (
    appName: string,
    object: ObjectConfigOptions,
  ) => {
    const { name } = object;
    return <>{appName} is reading the following <b>{name.displayName}</b> fields:</>;
  },
};

export function InstallIntegration(
  { integration, api, redirectUrl = undefined }: InstallIntegrationProps,
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
      redirectUrl={redirectUrl}
    />
  );
}

export function ReconfigureIntegration(
  { integration, api, redirectUrl = undefined }: InstallIntegrationProps,
) {
  const sourceList: SourceList | null = useContext(SourceListContext);
  const { subdomain } = useContext(SubdomainContext);
  const [source, setSource] = useState<IntegrationSource | null>(null);
  const [userConfig, setUserConfig] = useState<IntegrationConfig | undefined>(undefined);

  // GET USER'S EXISTING CONFIG IF EXISTING
  useEffect(() => {
    if (sourceList) {
      const sourceFromList = findSourceFromList(integration, sourceList);

      if (sourceFromList) {
        setSource(sourceFromList);
        setUserConfig(getUserConfig(sourceFromList, subdomain, api));
      }
    }
  }, [sourceList]);

  if (!source || !subdomain || !userConfig) {
    return <CenteredTextBox text="There is an error" />;
  }

  return (
    <ConfigureIntegration
      source={source}
      api={api}
      subdomain={subdomain}
      userConfig={userConfig}
      redirectUrl={redirectUrl}
    />
  );
}

interface ConfigureIntegrationProps {
  source: IntegrationSource;
  subdomain: string;
  api: string,
  userConfig?: IntegrationConfig,
  redirectUrl?: string,
}

function ConfigureIntegration({
  source, subdomain, api, userConfig = undefined, redirectUrl = undefined,
}: ConfigureIntegrationProps) {
  const { type } = source;
  if (type === 'read') {
    return (
      <SetUpRead
        source={source}
        subdomain={subdomain}
        userConfig={userConfig}
        api={api}
        redirectUrl={redirectUrl}
      />
    );
  } if (type === 'write') {
    return <SetUpWrite />;
  }
  return null;
}

function SetUpRead({
  source, subdomain, api, userConfig = undefined, redirectUrl = undefined,
}: ConfigureIntegrationProps) {
  let config: IntegrationConfig;
  if (!userConfig) {
    config = getDefaultConfigForSource(source.objects);
  } else {
    config = merge(getDefaultConfigForSource(source.objects), userConfig);
  }

  const [integrationConfig, setIntegrationConfig] = useState(config);
  const [isSuccessfulNoRedirect, setIsSuccessfulNoRedirect] = useState(false);
  const sourceList: SourceList | null = useContext(SourceListContext);

  let appName = 'this app';
  if (sourceList) {
    appName = sourceList.appName;
  }
  const { objects } = source;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    /* eslint-disable-next-line no-console */
    console.log('submitted');
    postUserConfig(integrationConfig);

    if (redirectUrl) {
      redirectTo(redirectUrl);
    } else {
      setIsSuccessfulNoRedirect(true);
    }
  };

  const elems = map(objects, (object: ObjectConfigOptions) => {
    let mandatoryFields;
    let optionalFields;
    let customFieldMapping;

    if (object.requiredFields) {
      let configureString = strings.configureRequiredFields(appName, object);
      if (userConfig) {
        configureString = strings.reconfigureRequiredFields(appName, object);
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
                defaultValue={userSelectedFieldMapping?.[mapping.mapToName]}
              >
                {map(mapping.choices, (choice: DataField) => (
                  <option
                    value={choice.fieldName}
                    key={choice.fieldName}
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

  let IntroString = strings.configureIntro(appName, api, subdomain);

  if (userConfig) {
    IntroString = strings.reconfigureIntro(appName, api, subdomain);
  }

  if (isSuccessfulNoRedirect) {
    return (
      <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin="auto" marginTop="40px" bgColor="white">
        <Text>Success!</Text>
      </Box>
    );
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

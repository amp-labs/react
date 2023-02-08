import React, { FormEvent, useContext, useState } from 'react';
import {
  merge, map, set, capitalize,
} from 'lodash';
import {
  Switch, FormControl, FormLabel, Button, Box, UnorderedList, ListItem, Select, Text, SimpleGrid,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import generateDefaultIntegrationConfig from '../../library/utils/generateDefaultIntegrationConfig';
import { IntegrationSource, SourceList } from '../types/configTypes';
import CenteredTextBox from '../CenteredTextBox';
import { findSourceFromList } from '../../utils';
import { AmpersandContext } from '../AmpersandProvider/AmpersandProvider';

interface ConfigureIntegrationProps {
  integration: string,
  api: string,
  subdomain: string,
}

export function ConfigureIntegration(
  { integration, api, subdomain }: ConfigureIntegrationProps,
) {
  const sourceList: SourceList | null = useContext(AmpersandContext);
  let source;

  if (sourceList) {
    source = findSourceFromList(integration, sourceList);
  }

  if (!source) {
    return <CenteredTextBox text="There is an error" />;
  }

  /* eslint-disable-next-line no-console */
  console.log(`Successfully got integration source${JSON.stringify(source, null, 2)}`);
  return (
    <InstallIntegration
      source={source}
      api={api}
      subdomain={subdomain}
    />
  );
}

interface InstallProps {
  source: IntegrationSource;
  subdomain: string;
  api: string,
}
export function InstallIntegration({ source, subdomain, api }: InstallProps) {
  const { type } = source;
  if (type === 'read') {
    return <SetUpRead source={source} subdomain={subdomain} api={api} />;
  } if (type === 'write') {
    return <SetUpWrite />;
  }
  return null;
}

function SetUpRead({ source, subdomain, api }: InstallProps) {
  const [integrationConfig, setIntegrationConfig] = useState(
    generateDefaultIntegrationConfig(source),
  );
  const navigate = useNavigate();
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    /* eslint-disable-next-line no-console */
    console.log('submitted');
    navigate('/configure-write');
  };
  const appName = 'MailMonkey'; // TODO: should read from source.
  const { objects } = source;

  const elems = map(objects, (object) => {
    let mandatoryFields;
    let optionalFields;
    let customFieldMapping;

    if (object.requiredFields) {
      mandatoryFields = (
        <>
          <Text marginBottom="10px">
            {appName} will read the following <b>{object.name.displayName}</b> fields:
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
      optionalFields = (
        <>
          <FormControl>
            <Text color="gray.600" marginBottom="5px">Optional:</Text>
            {map(object.optionalFields, (field) => (
              <Box key={field.fieldName} as={SimpleGrid} columns={{ base: 2, lg: 2 }}>
                <FormLabel htmlFor={field.fieldName} margin="0" paddingRight="20px">
                  { field.displayName }
                </FormLabel>
                <Switch
                  id={field.fieldName}
                  defaultChecked={field.default === 'selected'}
                  onChange={(e) => {
                    const newConfig = set(
                      {},
                      [object.name.objectName, 'selectedOptionalFields', field.fieldName],
                      e.target.checked,
                    );
                    setIntegrationConfig(merge({}, integrationConfig, newConfig));
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
      customFieldMapping = (
        <>
          {map(object.customFieldMapping, (mapping) => (
            <div key={mapping.mapToName}>
              <Text marginBottom="10px">
                Which of your custom fields from <b>{object.name.displayName}</b> should be mapped
                to <b>{mapping.mapToDisplayName}</b>?
              </Text>
              <Text color="gray.600" marginBottom="10px">{mapping.prompt}</Text>
              <Select
                placeholder="Select custom field"
                onChange={(e) => {
                  const newConfig = set(
                    {},
                    [object.name.objectName, 'selectedFieldMapping', mapping.mapToName],
                    e.target.value,
                  );
                  setIntegrationConfig(merge({}, integrationConfig, newConfig));
                }}
              >
                {map(mapping.choices, (choice) => (
                  <option value={choice.fieldName} key={choice.fieldName}>
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

  return (
    <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin="auto" marginTop="40px" bgColor="white">
      <Text marginBottom="20px">
        Let's integrate {appName} with your {capitalize(api)} instance <b>{subdomain}</b>.
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

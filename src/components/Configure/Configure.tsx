import React, { useState } from 'react';
import { IntegrationSource } from '../types/configTypes';
import { merge, map, set, capitalize } from 'lodash';
import { Switch, FormControl, FormLabel, Button, Box, UnorderedList, ListItem, Select, Text, SimpleGrid } from '@chakra-ui/react';
import { generateDefaultIntegrationConfig } from '../../library/utils/generateDefaultIntegrationConfig';
import { useCallableFunctionResponse } from 'reactfire';
import { useNavigate } from 'react-router-dom';
import CenteredTextBox from '../CenteredTextBox';

// TODO: for each provider, there may actually be multiple integrations available.
interface ConfigureIntegrationProps {
  provider: string,
  subdomain: string,
  connectionId: string,
}
export const ConfigureIntegration = ({provider, subdomain, connectionId}: ConfigureIntegrationProps) => {
  const { status, data: source } = useCallableFunctionResponse('getIntegrationSource', { data: { provider, subdomain, connectionId} });

  switch (status) {
    case 'loading':
      return <CenteredTextBox text='Loading...'/>
    case 'success':
      console.log("Successfully got integration source" + JSON.stringify(source, null, 2))
      return (<InstallIntegration 
        source={source as IntegrationSource}
        provider={provider}
        subdomain={subdomain}
      />);
    default:
      return <CenteredTextBox text='There is an error'/>
  }
}

interface InstallProps {
  source: IntegrationSource;
  subdomain: string;
  provider: string,
}
export const InstallIntegration = ({ source, subdomain, provider }: InstallProps) => {
  if (source.type === 'read') {
    return <SetUpRead source={source} subdomain={subdomain} provider={provider}/>
  }
  return <SetUpWrite source={source} subdomain={subdomain} provider={provider} />
}

const SetUpRead = ({ source, subdomain, provider }: InstallProps) => {
  const [integrationConfig, setIntegrationConfig] = useState(generateDefaultIntegrationConfig(source));
  const navigate = useNavigate();
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('submitted');
    navigate('/configure-write');
  };
  const appName = 'MailMonkey'; // TODO: should read from source.

  const elems = map(source.objects, (object) => {
    let mandatoryFields = <></>;
    let optionalFields = <></>;
    let customFieldMapping = <></>;
    
    if (object.requiredFields) {
      mandatoryFields = (
      <>
        <Text marginBottom='10px'>
            {appName} will read the following <b>{object.name.displayName}</b> fields:
        </Text>
        <FormControl >
          {map(object.requiredFields, (field) => {
            return (
              <Box key={field.fieldName} as={SimpleGrid} columns={{ base: 2, lg: 2 }}>
                <FormLabel htmlFor={field.fieldName} margin='0' paddingRight='20px'>
                  {field.displayName}
                </FormLabel>
                <Switch id={field.fieldName} defaultChecked={true} isDisabled/>
              </Box>
            );
          })}
        </FormControl>
        <br></br>
      </>)
    }
    
    if (object.optionalFields) {
      optionalFields = (
        <>
          <FormControl >
            <Text color='gray.600' marginBottom="5px">Optional:</Text>
            {map(object.optionalFields,(field) => {
              return (
                <Box key={field.fieldName} as={SimpleGrid} columns={{ base: 2, lg: 2 }}>
                  <FormLabel htmlFor={field.fieldName} margin='0' paddingRight='20px'>
                    { field.displayName }
                  </FormLabel>
                  <Switch id={field.fieldName} defaultChecked={field.default === 'selected'} onChange={e => {
                    const newConfig = set(
                      {}, 
                      [object.name.objectName, 'selectedOptionalFields', field.fieldName],
                      e.target.checked
                    );
                    setIntegrationConfig(merge({}, integrationConfig, newConfig));
                  }}/>
                </Box>
              );
            })}
          </FormControl>
          <br></br>
        </>)      
    }

    if (object.customFieldMapping) {
      customFieldMapping = (
        <>
          {map(object.customFieldMapping, (mapping) => (<div key={mapping.mapToName}>
            <Text marginBottom='10px'>
              Which of your custom fields from <b>{object.name.displayName}</b> should be mapped to <b>{mapping.mapToDisplayName}</b>?
            </Text>
            <Text color='gray.600' marginBottom='10px'>{mapping.prompt}</Text>
            <Select placeholder='Select custom field' onChange={e => {
              const newConfig = set(
                {},
                [object.name.objectName, 'selectedFieldMapping', mapping.mapToName],
                e.target.value
              );
              setIntegrationConfig(merge({}, integrationConfig, newConfig));
            }}>
              {map(mapping.choices, (choice) => (
                <option value={choice.fieldName} key={choice.fieldName}>
                  {choice.displayName}
                </option>
              ))}
            </Select>
          </div>))}
          <br></br>
        </>);
    }

    return (
      <Box key={object.name.objectName} marginTop='20px' marginBottom='10px'>
        {mandatoryFields}
        {optionalFields}
        {customFieldMapping}
      </Box>
    );
  });

  return (
    <Box p={8} maxWidth='600px' borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin='auto' marginTop='40px' bgColor='white'>
      <Text marginBottom='20px'>Let's integrate {appName} with your {capitalize(provider)} instance <b>{subdomain}</b>. </Text>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        {elems}
        <Button type='submit'>Next</Button>
      </form>
    </Box>
  );
}

const SetUpWrite = (props: InstallProps) => {
  return (<>TODO</>)
}

export const SetUpWriteTemp = () => {
  const navigate = useNavigate();
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('submitted');
    navigate('/data');
  };
  const prompt = 'Every time we send out an email, we will record it as an Email within Salesforce.';
  const objectDisplayName = 'Email';
  const appName = 'MailMonkey';
  const provider = 'Salesforce';
  const elems = (<Box marginTop='20px' marginBottom='10px'>
    <Text marginBottom='10px'>
      {appName} will save <b>{objectDisplayName}s</b> to {provider}.
    </Text>
    <Text color='gray.600' marginBottom='10px'>{prompt}</Text>
    <Text marginBottom='10px'>
      Each {objectDisplayName} will include the following fields:
    </Text>
    <UnorderedList>
      <ListItem>Subject</ListItem>
      <ListItem>Status</ListItem>
      <ListItem>Contact ID</ListItem>
      <ListItem>Description</ListItem>
    </UnorderedList>
    <br></br>
  </Box>);

  return (
    <Box p={8} maxWidth='600px' borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin='auto' marginTop='40px' bgColor='white'>
      <Text marginBottom='20px'>Let's integrate MailMonkey with your Salesforce instance <b>boxit2-dev-ed</b>.</Text>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        {elems}
        <Button type='submit'>Install</Button>
      </form>
    </Box>
  );
}

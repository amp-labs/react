import React, { useContext, useState } from 'react';
import Pizzly from '@nangohq/pizzly-frontend';
import { Box, Button } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import { AmpersandContext } from '../AmpersandProvider';
import { findSourceFromList } from '../../utils';
import { SourceList, IntegrationSource } from '../types/configTypes';

const pizzly = new Pizzly('http://localhost:3003');

interface ConnectProviderProps {
  integration: string,
  connectionId: string,
}

function ConnectProvider({ integration, connectionId }: ConnectProviderProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const sourceList: SourceList | null = useContext(AmpersandContext);
  let source: IntegrationSource | null;

  if (sourceList) {
    source = findSourceFromList(integration, sourceList);
  }

  const launchLogIn = () => {
    if (!source?.api) return;

    const { api } = source;

    pizzly.auth(api, connectionId)
      .then((result) => {
        /* eslint-disable-next-line no-console */
        console.log(`OAuth flow succeeded for provider "${result.providerConfigKey}" and connection-id "${result.connectionId}"! ${JSON.stringify(result)}`);
        setLoggedIn(true);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error(`There was an error in the OAuth flow for integration "${error.providerConfigKey}" and connection-id "${error.connectionId}": ${error.error.type} - ${error.error.message}`);
        setLoggedIn(false);
      });
  };

  return loggedIn
    ? <Navigate to="/configure" />
    : (
      <Box margin="auto" width="200px" paddingTop="200px" textAlign="center">
        <Button margin="30px" onClick={launchLogIn}>Connect Salesforce</Button>
      </Box>
    );
}

export default ConnectProvider;

import React, { useContext, useState } from 'react';
import Pizzly from '@nangohq/pizzly-frontend';
import { Box, Button } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import { AmpersandContext } from '../AmpersandProvider';
import { IntegrationSource } from '../types/configTypes';

const pizzly = new Pizzly('http://localhost:3003');

// interface ConnectProviderProps {
//   provider: string,
//   // subdomain: string,
//   connectionId: string,
// }
interface ConnectProviderProps {
  connectionId: string,
}

function ConnectProvider({ connectionId }: ConnectProviderProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const source: IntegrationSource | null = useContext(AmpersandContext);

  // if (options.provider !== 'salesforce') {
  //   return (<>Not supported</>);
  // }

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

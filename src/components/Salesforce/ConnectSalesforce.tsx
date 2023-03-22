/**
 * ConnectSalesforce.tsx
 *
 * Component that prompts user to connect Salesforce, connecting subdomain and OAuth.
 */

import React, { useContext } from 'react';

import { Box, Container, Text } from '@chakra-ui/react';
import SalesforceSubdomainEntry from './SalesforceSubdomainEntry';
import { ProviderConnectionContext, SubdomainContext } from '../AmpersandProvider';

function ConnectSalesforce() {
  const { isConnectedToProvider } = useContext(ProviderConnectionContext);
  const { subdomain } = useContext(SubdomainContext);

  const successText = `Salesforce instance ${subdomain} successfully connected.`;
  const Success = (
    <Container>
      <Box>
        <Text>{successText}</Text>
      </Box>
    </Container>
  );

  if (isConnectedToProvider.salesforce && subdomain) {
    return Success;
  }

  return <SalesforceSubdomainEntry />;
}

export default ConnectSalesforce;

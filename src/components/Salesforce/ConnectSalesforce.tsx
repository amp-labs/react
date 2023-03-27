/**
 * ConnectSalesforce.tsx
 *
 * Component that prompts user to connect Salesforce, connecting subdomain and OAuth.
 */

import React, { useContext } from 'react';

import { Box, Container, Text } from '@chakra-ui/react';
import SalesforceOauthFlow from './SalesforceOauthFlow';
import { ProviderConnectionContext, SubdomainContext } from '../AmpersandProvider';
import { redirectTo } from '../../utils';

interface ConnectSalesforceProps {
  userId: string;
  groupId: string;
  redirectUrl?: string;
}

export function ConnectSalesforce({ userId, groupId, redirectUrl } : ConnectSalesforceProps) {
  const { isConnectedToProvider } = useContext(ProviderConnectionContext);
  const { subdomain } = useContext(SubdomainContext);

  const successText = `Salesforce instance ${subdomain} successfully connected.`;
  const successBox = (
    <Container>
      <Box>
        <Text>{successText}</Text>
      </Box>
    </Container>
  );

  if (isConnectedToProvider.salesforce && subdomain) {
    if (redirectUrl) {
      redirectTo(redirectUrl);
    }
    return successBox;
  }

  return (
    <SalesforceOauthFlow
      userId={userId}
      groupId={groupId}
    />
  );
}

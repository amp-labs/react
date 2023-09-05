/**
 * ConnectSalesforce.tsx
 *
 * Component that prompts user to connect Salesforce, connecting subdomain and OAuth.
 */

import { Box, Container, Text } from '@chakra-ui/react';

import { useProviderConnection } from '../../context/ProviderConnectionContext';
import { useSubdomain } from '../../context/SubdomainProvider';
import { redirectTo } from '../../utils';

import SalesforceOauthFlow from './SalesforceOauthFlow';

interface ConnectSalesforceProps {
  userId: string;
  groupId: string;
  redirectUrl?: string;
}

export function ConnectSalesforce({ userId, groupId, redirectUrl } : ConnectSalesforceProps) {
  const { isConnectedToProvider } = useProviderConnection();
  const { subdomain } = useSubdomain();

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

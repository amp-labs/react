import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Link,
} from '@chakra-ui/react';

import { ConnectionsProvider } from '../../context/ConnectionsContext';
import { ProtectedConnectionLayout } from '../Configure/ProtectedConnectionLayout';
import { useProject } from '../../context/ProjectContext';
import { capitalize } from '../../utils';

interface ConnectProviderProps {
  provider: string,
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
}

export function ConnectProvider(
  {
    provider, consumerRef, consumerName, groupRef, groupName,
  }: ConnectProviderProps,
) {
  const { appName } = useProject();
  const ConnectedSuccessBox = (
    <Container>
      <Box p={8} maxWidth="600px" height="290px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['center']} margin="auto" marginTop="40px" bgColor="white">
        <div>{`You've successfully connected ${capitalize(provider)} to ${appName}.`}</div>
      </Box>
    </Container>
  );
  return (
    <ConnectionsProvider provider={provider} groupRef={groupRef}>
      <ProtectedConnectionLayout
        provider={provider}
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      >
        {ConnectedSuccessBox }
      </ProtectedConnectionLayout>
    </ConnectionsProvider>
  );
}

import {
  Box, Container,
} from '@chakra-ui/react';

import { CheckMarkIcon } from '../../assets/NavIcon';
import { ConnectionsProvider } from '../../context/ConnectionsContext';
import { useProject } from '../../context/ProjectContext';
import { capitalize } from '../../utils';
import { ProtectedConnectionLayout } from '../Configure/ProtectedConnectionLayout';

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
      {/* TODO: create a "ShadowedBox" component that has the shadow and border styling. */}
      <Box p={8} maxWidth="600px" minHeight="290px" borderWidth={1} borderRadius={8} boxShadow="lg" margin="auto" marginTop="40px" bgColor="white" paddingTop="100px">
        <Box width="100%" display="flex" alignContent="center" justifyContent="center">
          <Box margin="auto">{CheckMarkIcon}</Box>
        </Box>
        <Box textAlign="center" paddingTop="25px">
          {`You've successfully connected ${capitalize(provider)} to ${appName}.`}
        </Box>
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

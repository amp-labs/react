import {
  Box, Container,
} from '@chakra-ui/react';

import { CheckMarkIcon } from '../../assets/NavIcon';
import { ConnectionsProvider } from '../../context/ConnectionsContext';
import { useProject } from '../../context/ProjectContext';
import { capitalize } from '../../utils';
import { ProtectedConnectionLayout } from '../Configure/ProtectedConnectionLayout';
import { RedirectHandler } from '../RedirectHandler';

interface ConnectedSuccessBoxProps {
  provider: string;
}
function ConnectedSuccessBox({ provider }: ConnectedSuccessBoxProps) {
  const { appName } = useProject();

  return (
    <Container>
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
}

interface ConnectProviderProps {
  provider: string,
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  redirectUrl?: string,
}

export function ConnectProvider(
  {
    provider, consumerRef, consumerName, groupRef, groupName, redirectUrl,
  }: ConnectProviderProps,
) {
  return (
    <ConnectionsProvider provider={provider} groupRef={groupRef}>
      <ProtectedConnectionLayout
        provider={provider}
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      >
        <RedirectHandler redirectURL={redirectUrl}>
          <ConnectedSuccessBox provider={provider} />
        </RedirectHandler>
      </ProtectedConnectionLayout>
    </ConnectionsProvider>
  );
}

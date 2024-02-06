import { Box, Container } from '@chakra-ui/react';

import { CheckMarkIcon } from '../../assets/NavIcon';
import { useProject } from '../../context/ProjectContextProvider';
import { capitalize } from '../../utils';

interface ConnectedSuccessBoxProps {
  provider: string;
}
export function ConnectedSuccessBox({ provider }: ConnectedSuccessBoxProps) {
  const { appName } = useProject();

  return (
    <Container>
      <Box
        p={8}
        maxWidth="600px"
        minHeight="290px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        margin="auto"
        marginTop="40px"
        bgColor="white"
        paddingTop="100px"
      >
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

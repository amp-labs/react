import { Box, Container } from '@chakra-ui/react';

import { SuccessCheckmarkIcon } from 'assets/SuccessIcon';

interface ConnectedSuccessBoxProps {
  text: string;
}
export function SuccessTextBox({ text }: ConnectedSuccessBoxProps) {
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
        color="gray.800"
        fontSize="md"
      >
        <Box width="100%" display="flex" alignContent="center" justifyContent="center">
          <Box margin="auto"><SuccessCheckmarkIcon /></Box>
        </Box>
        <Box textAlign="center" paddingTop="25px">
          {text}
        </Box>
      </Box>
    </Container>
  );
}

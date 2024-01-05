import {
  Box, Button, Container, FormControl,
  FormLabel, Heading,
} from '@chakra-ui/react';

import { capitalize } from '../../../utils';
import { OAuthErrorAlert } from '../OAuthErrorAlert';

type LandingContentProps = {
  provider: string;
  handleSubmit: () => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

export function LandingContent({
  provider, handleSubmit, error, isButtonDisabled,
}: LandingContentProps) {
  return (
    <Container>
      <Box
        p={8}
        maxWidth="600px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        textAlign={['left']}
        margin="auto"
        marginTop="40px"
        bgColor="white"
      >
        <FormControl>
          <FormLabel marginTop="16" marginBottom="0">
            <Heading as="h4" size="md">{`Set up ${capitalize(provider)} integration`}</Heading>
          </FormLabel>
          <OAuthErrorAlert error={error} />
          <br />
          <Button
            isDisabled={isButtonDisabled}
            width="100%"
            type="submit"
            onClick={handleSubmit}
          >
            Next
          </Button>
        </FormControl>
      </Box>
    </Container>
  );
}

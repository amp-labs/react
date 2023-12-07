import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box, Button, Container, Flex, FormControl,
  FormLabel, Heading, Input, Link, Text,
} from '@chakra-ui/react';

import { OAuthErrorAlert } from '../OAuthErrorAlert';

type HubspotLandingContentProps = {
  handleSubmit: () => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

export function HubspotLandingContent({
  handleSubmit, error, isButtonDisabled,
}: HubspotLandingContentProps) {
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
            <Heading as="h4" size="md">Set up HubSpot integration</Heading>
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

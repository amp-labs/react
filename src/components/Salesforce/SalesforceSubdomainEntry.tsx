import {
  Box, Container, FormControl, FormLabel, Input,
} from '@chakra-ui/react';

function SalesforceSubdomainEntry() {
  return (
    <Container>
      <Box>
        <FormControl>
          <FormLabel>Subdomain</FormLabel>
          <Input placeholder="mydomain" />
        </FormControl>
      </Box>
    </Container>
  );
}

export default SalesforceSubdomainEntry;

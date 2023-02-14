import {
  Box, Container, Flex, FormControl, FormLabel, Input, Text,
} from '@chakra-ui/react';

function SalesforceSubdomainEntry() {
  return (
    <Container>
      <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin="auto" marginTop="40px" bgColor="white">
        <FormControl>
          <FormLabel>Subdomain</FormLabel>
          <Flex>
            <Input placeholder="mydomain" />
            <Text>.my.salesforce.com</Text>
          </Flex>
        </FormControl>
      </Box>
    </Container>
  );
}

export default SalesforceSubdomainEntry;

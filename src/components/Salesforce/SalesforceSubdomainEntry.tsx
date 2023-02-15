import { useContext } from 'react';
import {
  Box, Button, Container, Flex, FormControl, FormLabel, Input, Image, Text,
} from '@chakra-ui/react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const salesforceLogo = require('../../public/images/apis/salesforce/Salesforce_Corporate_Logo_RGB.png');

function SalesforceSubdomainEntry() {
  return (
    <Container>
      <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin="auto" marginTop="40px" bgColor="white">
        <FormControl>
          <Image
            src={salesforceLogo}
            alt="Salesforce logo"
          />
          {/* <img src={salesforceLogo} alt="Salesforce logo" /> */}
          <FormLabel>Enter your Salesforce subdomain</FormLabel>
          <Flex>
            <Input placeholder="mydomain" />
            <Text>.my.salesforce.com</Text>
          </Flex>
          <br />
          <Button type="submit">Submit</Button>
        </FormControl>
      </Box>
    </Container>
  );
}

export default SalesforceSubdomainEntry;

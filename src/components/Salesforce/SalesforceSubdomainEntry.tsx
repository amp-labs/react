import { useState } from 'react';
import {
  Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Image, Link, Text,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const salesforceLogo = require('../../public/images/apis/salesforce/Salesforce_Corporate_Logo_RGB.png');

/**
 * User input for Salesforce subdomain.
 *
 * TODO: Implement error state.
 */
function SalesforceSubdomainEntry() {
  const [subdomain, setSubdomain] = useState('');

  const handleSubmit = async (event) => {
    // set subdomain value
  };

  return (
    <Container>
      <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin="auto" marginTop="40px" bgColor="white">
        <FormControl>
          <Image
            width="40%"
            height="auto"
            margin="0 auto"
            src={salesforceLogo}
            alt="Salesforce logo"
          />
          <FormLabel
            marginTop="3em"
            marginBottom="0"
          >
            <Heading as="h4" size="lg">
              Enter your Salesforce subdomain
            </Heading>
          </FormLabel>
          <Link
            href="https://help.salesforce.com/s/articleView?id=sf.faq_domain_name_what.htm&type=5"
            color="blackAlpha.600"
            isExternal
          >
            What is my Salesforce subdomain? <ExternalLinkIcon mx="2px" />
          </Link>
          <Flex marginTop="1em">
            <Input
              placeholder="MyDomain"
              onChange={(event) => setSubdomain(event.currentTarget.value)}
            />
            <Text lineHeight="2.2em" marginLeft="0.4em">.my.salesforce.com</Text>
          </Flex>
          <br />
          <Button type="submit" onClick={handleSubmit}>Submit</Button>
        </FormControl>
      </Box>
    </Container>
  );
}

export default SalesforceSubdomainEntry;

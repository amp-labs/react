import { useContext, useState } from 'react';
import {
  Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Image, Link, Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { SubdomainContext } from '../AmpersandProvider';
import OAuthPopup from '../OAuthPopup';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const salesforceLogo = require('../../public/images/apis/salesforce/Salesforce_Corporate_Logo_RGB.png');

const AMP_OAUTH_URL = 'https://oauth-server-msdauvir5a-uc.a.run.app/connect-oauth';

/**
 * User input for Salesforce customerSubdomain.
 *
 * TODO: Implement error state.
 */
function SalesforceSubdomainEntry() {
  const [customerSubdomain, setCustomerSubdomain] = useState<string | null>('');
  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>('');

  const { setSubdomain } = useContext(SubdomainContext);

  const handleSubmit = async () => {
    setSubdomain(customerSubdomain);

    axios.post(AMP_OAUTH_URL, {
      Subdomain: customerSubdomain,
      Api: 'salesforce',
      ProjectId: 'foo',
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(((res) => {
      const url = res.data;
      setOAuthCallbackURL(url);
    }));
  };

  const SubdomainEntry = (
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
              onChange={(event) => setCustomerSubdomain(event.currentTarget.value)}
            />
            <Text lineHeight="2.2em" marginLeft="0.4em">.my.salesforce.com</Text>
          </Flex>
          <br />
          <Button type="submit" onClick={handleSubmit}>Submit</Button>
        </FormControl>
      </Box>
    </Container>
  );

  if (oAuthCallbackURL) {
    return (
      <OAuthPopup
        title="OAuth to Salesforce"
        url={oAuthCallbackURL}
        onClose={() => { console.log('onClose'); }} // eslint-disable-line
      >
        { SubdomainEntry }
      </OAuthPopup>
    );
  }

  return SubdomainEntry;
}

export default SalesforceSubdomainEntry;

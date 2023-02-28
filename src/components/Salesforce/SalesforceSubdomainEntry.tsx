import { useContext, useState } from 'react';
import {
  Alert, AlertIcon, AlertTitle, AlertDescription, Box, Button, Container, Flex, FormControl,
  FormLabel, Heading, Input, Image, Link, Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { SubdomainContext } from '../AmpersandProvider';
import OAuthPopup from '../OAuthPopup';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const salesforceLogo = require('../../public/images/apis/salesforce/Salesforce_Corporate_Logo_RGB.png');

const AMP_OAUTH_URL = 'https://oauth-server-msdauvir5a-uc.a.run.app/connect-oauth';

interface OAuthErrorAlertProps {
  error: boolean;
}

function OAuthErrorAlert({ error }: OAuthErrorAlertProps) {
  // TODO: RENDER AN ACTUAL ERROR FROM SALESFORCE OAUTH FLOW INSTEAD OF GENERIC MSG
  if (error) {
    return (
      <Alert status="error" marginTop="2em">
        <AlertIcon />
        <AlertDescription>
          There was an error logging into your Salesforce subdomain. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

/**
 * User input for Salesforce customerSubdomain.
 *
 * TODO: Implement error state.
 */
function SalesforceSubdomainEntry() {
  const [customerSubdomain, setCustomerSubdomain] = useState<string | null>(null);
  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  const { setSubdomain } = useContext(SubdomainContext);

  const handleSubmit = async () => {
    setSubdomain(customerSubdomain);
    setError(false);

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
      setOAuthCallbackURL(`${url}&prompt=login`);
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
          <OAuthErrorAlert error={error} />
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
        onClose={(err: boolean) => { if (err) setError(true); }}
      >
        { SubdomainEntry }
      </OAuthPopup>
    );
  }

  return SubdomainEntry;
}

export default SalesforceSubdomainEntry;

import { FormEvent, useState } from 'react';
import {
  Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Image, Link, Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import OAuthPopup from '../OAuthPopup';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const salesforceLogo = require('../../public/images/apis/salesforce/Salesforce_Corporate_Logo_RGB.png');

const AMP_OAUTH_URL = 'https://oauth-server-msdauvir5a-uc.a.run.app/connect-oauth';
// const AMP_OAUTH_URL = 'https://oauth-server-msdauvir5a-uc.a.run.app/ping';
// const AMP_OAUTH_URL = 'http:localhost:8080/connect-oauth';

/**
 * User input for Salesforce subdomain.
 *
 * TODO: Implement error state.
 */
function SalesforceSubdomainEntry() {
  const [subdomain, setSubdomain] = useState<string | null>('');
  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>('');

  const handleSubmit = async (event: FormEvent) => {
    console.log('EVENT'); /* eslint-disable-line no-console */
    console.log(event); /* eslint-disable-line no-console */

    // STUB instead of network call
    // setOAuthCallbackURL('https://boxit2-dev-ed.my.salesforce.com/services/oauth2/authorize?prompt=login&client_id=3MVG9kBt168mda__AsLfwj2vUtrPMp39Nvj9amL1F7wMQhoDK7FgznCLTvYMIYLcDidAVGom5YCeiVbbFkE3X&redirect_uri=https://oauth-server-msdauvir5a-uc.a.run.app/oauth-callback&response_type=code&state=%7B%22Subdomain%22%3A%22boxit2-dev-ed%22%2C%22Api%22%3A%22salesforce%22%2C%22ProjectId%22%3A%22foo%22%7D');

    // setOAuthCallbackURL('https://oauth-server-msdauvir5a-uc.a.run.app/ping')
    axios.post(AMP_OAUTH_URL, {
      Subdomain: subdomain,
      Api: 'salesforce',
      ProjectId: 'foo',
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(((res) => {
      console.log("GOT THE AUTH URL -> ", res.data)
      setOAuthCallbackURL(res.data + '&prompt=login');
      // setOAuthCallbackURL(URL)
    }));
  };

  // IF CODE PARAM EXISTS, THAT'S SUCCESSFUL
  // ONCE REDIRECT TO SUCCESS URL HAPPENS, JUST CLOSE THAT POPUP
  // const successURL = 'https://oauth-server-msdauvir5a-uc.a.run.app/oauth-callback?code=aPrxxWbemCeRRVE9CO5dOoe7AGEl1H38iTpfzBCvxWVHlGSZundxgtBV5Q1a9OpxYlDypXorpQ%3D%3D&state=%7B%22Subdomain%22%3A%22boxit2-dev-ed%22%2C%22Api%22%3A%22salesforce%22%2C%22ProjectId%22%3A%22foo%22%7D';

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

  if (oAuthCallbackURL) {
    return (
      <OAuthPopup
        title="OAuth to Salesforce"
        url={oAuthCallbackURL}
        onCode={() => { console.log('onCodee'); }} // eslint-disable-line
        onClose={() => { console.log('onClose'); }} // eslint-disable-line
      >
        { SubdomainEntry }
      </OAuthPopup>
    );
  }

  return SubdomainEntry;
}

export default SalesforceSubdomainEntry;

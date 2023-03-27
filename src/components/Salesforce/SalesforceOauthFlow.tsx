/**
 * SalesforceSubdomainEntry.tsx
 *
 * Prompts customer to input their Salesforce subdomain, then creates an OAuth connection to
 * that Salesforce instance.
 */

import React, { useContext, useState } from 'react';
import {
  Alert, AlertIcon, AlertDescription, Box, Button, Container, Flex, FormControl,
  FormLabel, Heading, Input, Image, Link, Text,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { ProjectIDContext, SubdomainContext } from '../AmpersandProvider';
import OAuthPopup from '../OAuthPopup/OAuthPopup';
import { postConnectOAuth } from '../../services/apiService';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const salesforceLogo = require('../../public/images/apis/salesforce/Salesforce_Corporate_Logo_RGB.png');

interface OAuthErrorAlertProps {
  error: string | null;
}

function OAuthErrorAlert({ error }: OAuthErrorAlertProps) {
  if (error) {
    return (
      <Alert status="error" marginTop="2em">
        <AlertIcon />
        <AlertDescription>
          { error }
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

interface SalesforceOauthFlowProps {
  userId: string;
  groupId: string;
}

/**
 * User input for Salesforce customerSubdomain.
 */
function SalesforceOauthFlow({ userId, groupId }: SalesforceOauthFlowProps) {
  const [customerSubdomain, setCustomerSubdomain] = useState<string>('');
  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { setSubdomain } = useContext(SubdomainContext);
  const projectID = useContext(ProjectIDContext);

  const handleSubmit = async () => {
    setSubdomain(customerSubdomain);
    setError(null);

    if (customerSubdomain && projectID) {
      try {
        const res = await postConnectOAuth(userId, groupId, 'salesforce', customerSubdomain, projectID);
        const url = res.data;
        setOAuthCallbackURL(url);
      } catch (err: any) {
        setError(err.message);
      }
    }
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

  return (
    <OAuthPopup
      title="Connect to Salesforce"
      url={oAuthCallbackURL}
      onClose={(err: string | null) => {
        setError(err);
        setOAuthCallbackURL(null);
      }}
    >
      { SubdomainEntry }
    </OAuthPopup>
  );
}

export default SalesforceOauthFlow;
/**
 * Prompts customer to input their Salesforce subdomain, then creates an OAuth connection to
 * that Salesforce instance.
 */

import { useContext, useEffect, useState } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Alert, AlertDescription, AlertIcon, Box, Button, Container, Flex, FormControl,
  FormLabel, Heading, Image, Input, Link, Text,
} from '@chakra-ui/react';
import { ProviderApp } from 'amp-labs-generated-rest-sdk/src/models/models';
import { OauthConnectRequest } from 'amp-labs-generated-rest-sdk/src/models/OauthConnectRequest';

import { PROVIDER_SALESFORCE } from '../../constants';
import { ApiKeyContext } from '../../context/ApiKeyContext';
import { useProject } from '../../context/ProjectContext';
import { useSubdomain } from '../../context/SubdomainProvider';
import { api } from '../../services/api';
import OAuthPopup from '../OAuthPopup/OAuthPopup';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const salesforceLogo = require('../../../public/images/apis/salesforce/Salesforce_Corporate_Logo_RGB.png');

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
  userName?: string;
  groupId: string;
  groupName?: string;
}

/**
 * User input for Salesforce customerSubdomain.
 */
function SalesforceOauthFlow({
  userId, userName, groupId, groupName,
}: SalesforceOauthFlowProps) {
  const [customerSubdomain, setCustomerSubdomain] = useState<string>('');
  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { setSubdomain } = useSubdomain();
  const { projectId } = useProject();
  const apiKey = useContext(ApiKeyContext);

  const handleSubmit = async () => {
    setSubdomain(customerSubdomain);
    setError(null);

    if (customerSubdomain && projectId) {
      try {
        const providerApps = await api.listProviderApps({
          projectId,
        }, {
          headers: {
            'X-Api-Key': apiKey ?? '',
          },
        });
        const app = providerApps.find((a: ProviderApp) => a.provider === PROVIDER_SALESFORCE);

        if (!app) {
          throw new Error('You must first set up a Salesforce Connected App using the Ampersand Console.');
        }

        const params: OauthConnectRequest = {
          providerWorkspaceRef: customerSubdomain,
          projectId,
          groupRef: groupId,
          groupName,
          consumerRef: userId,
          consumerName: userName,
          providerAppId: app.id,
          provider: PROVIDER_SALESFORCE,
        };
        const res = await api.oauthConnect({ connectOAuthParams: params });
        const url = res.data;
        setOAuthCallbackURL(url);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? 'Unexpected error');
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
            What is my Salesforce subdomain?
            <ExternalLinkIcon mx="2px" />
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

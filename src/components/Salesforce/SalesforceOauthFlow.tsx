/**
 * Prompts customer to input their Salesforce subdomain, then creates an OAuth connection to
 * that Salesforce instance.
 */

import { useCallback, useState } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Alert, AlertDescription, AlertIcon, Box, Button, Container, Flex, FormControl,
  FormLabel, Heading, Input, Link, Text,
} from '@chakra-ui/react';

import { PROVIDER_SALESFORCE } from '../../constants';
import { useApiKey } from '../../context/ApiKeyProvider';
import { useProject } from '../../context/ProjectContext';
import { api, ProviderApp } from '../../services/api';
import OAuthPopup from '../OAuthPopup/OAuthPopup';

interface OAuthErrorAlertProps {
  error: string | null;
}

function OAuthErrorAlert({ error }: OAuthErrorAlertProps) {
  if (error) {
    return (
      <Alert status="error" marginTop="2em">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return null;
}

const SALESFORCE_HELP_URL = 'https://help.salesforce.com/articleView?id=domain_name_not_found.htm&type=5';

type SubdomainEntryProps = {
  handleSubmit: () => void;
  setWorkspace: (workspace: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

function SubdomainEntry({
  handleSubmit, setWorkspace, error, isButtonDisabled,
}: SubdomainEntryProps) {
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
            <Heading as="h4" size="md">Enter your Salesforce subdomain</Heading>
          </FormLabel>
          <Link href={SALESFORCE_HELP_URL} color="blackAlpha.600" isExternal>
            What is my Salesforce subdomain?
            <ExternalLinkIcon mx="2px" />
          </Link>
          <OAuthErrorAlert error={error} />
          <Flex marginTop="1em">
            <Input
              placeholder="MyDomain"
              onChange={(event) => setWorkspace(event.currentTarget.value)}
            />
            <Text lineHeight="2.2em" marginLeft="0.4em">.my.salesforce.com</Text>
          </Flex>
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

const fetchOAuthCallbackURL = async (
  projectId: string,
  workspace: string,
  consumerRef: string,
  groupRef: string,
  consumerName: string,
  groupName: string,
  apiKey: string,
  provider = PROVIDER_SALESFORCE,
): Promise<string> => {
  const providerApps = await api().listProviderApps({ projectId }, {
    headers: { 'X-Api-Key': apiKey ?? '' },
  });
  const app = providerApps.find((a: ProviderApp) => a.provider === provider);

  if (!app) {
    throw new Error(`You must first set up a ${provider} Connected App using the Ampersand Console.`);
  }

  const url = await api().oauthConnect({
    connectOAuthParams: {
      providerWorkspaceRef: workspace,
      projectId,
      groupRef,
      groupName,
      consumerRef,
      consumerName,
      providerAppId: app.id,
      provider,
    },
  });
  return url;
};

interface SalesforceOauthFlowProps {
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
}

/**
 * SalesforceOauthFlow first prompts user for their workspace ("subdomain" in Salesforce lingo),
 * then launches a popup with the OAuth flow.
 */
function SalesforceOauthFlow({
  consumerRef, consumerName, groupRef, groupName,
}: SalesforceOauthFlowProps) {
  const { projectId } = useProject();
  const apiKey = useApiKey();

  const [workspace, setWorkspace] = useState<string>('');
  const [oAuthCallbackURL, setOAuthCallbackURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isButtonDisabled = workspace.length === 0;
  const provider = PROVIDER_SALESFORCE;

  // 1. fetch provider apps
  // 2. find matching app to provider
  // 3. fetch OAuth callback URL from connection so that oath popup can be launched
  const handleSubmit = async () => {
    setError(null);
    if (workspace && consumerName && groupName && apiKey) {
      try {
        const url = await fetchOAuthCallbackURL(
          projectId,
          workspace,
          consumerRef,
          groupRef,
          consumerName,
          groupName,
          apiKey,
          provider,
        );
        setOAuthCallbackURL(url);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? 'Unexpected error');
      }
    } else {
      setError('missing required fields');
    }
  };

  const onClose = useCallback((err: string | null) => {
    setError(err);
    setOAuthCallbackURL(null);
  }, []);

  return (
    <OAuthPopup
      title="Connect to Salesforce"
      url={oAuthCallbackURL}
      onClose={onClose}
    >
      <SubdomainEntry
        handleSubmit={handleSubmit}
        setWorkspace={setWorkspace}
        error={error}
        isButtonDisabled={isButtonDisabled}
      />
    </OAuthPopup>
  );
}

export default SalesforceOauthFlow;

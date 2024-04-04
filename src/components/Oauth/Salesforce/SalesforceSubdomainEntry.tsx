import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button, Flex, FormControl,
  FormLabel, Heading, Input, Link, Text,
} from '@chakra-ui/react';

import { OauthCardLayout } from '../OauthCardLayout';
import { OAuthErrorAlert } from '../OAuthErrorAlert';

const SALESFORCE_HELP_URL = 'https://help.salesforce.com/s/articleView?id=sf.faq_domain_name_what.htm&type=5';

type SubdomainEntryProps = {
  handleSubmit: () => void;
  setWorkspace: (workspace: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

/**
 * Salesforce specific subdomain entry component, use workspace entry for other providers.
 * @param param0
 * @returns
 */
export function SalesforceSubdomainEntry({
  handleSubmit, setWorkspace, error, isButtonDisabled,
}: SubdomainEntryProps) {
  return (
    <OauthCardLayout>
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
    </OauthCardLayout>
  );
}

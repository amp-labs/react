import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button, FormControl,
  FormLabel, Heading, Input,
} from '@chakra-ui/react';

import { AuthErrorAlert } from 'components/auth/AuthErrorAlert/AuthErrorAlert';
import { AccessibleLink } from 'components/ui-base/AccessibleLink';
import { AuthCardLayout } from 'src/layout/AuthCardLayout/AuthCardLayout';

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
    <AuthCardLayout>
      <FormControl>
        <FormLabel>
          <Heading as="h4" size="md">Enter your Salesforce subdomain</Heading>
        </FormLabel>
        <AccessibleLink href={SALESFORCE_HELP_URL} newTab>
          {'What is my Salesforce subdomain? '}
          <ExternalLinkIcon />
        </AccessibleLink>
        <AuthErrorAlert error={error} />
        <div style={{ display: 'flex', marginTop: '1em' }}>
          <Input
            placeholder="MyDomain"
            onChange={(event) => setWorkspace(event.currentTarget.value)}
          />
          <p style={{ lineHeight: '2.2em', marginLeft: '0.4em' }}>.my.salesforce.com</p>
        </div>
        <br />
        <Button
          variant="primary"
          isDisabled={isButtonDisabled}
          width="100%"
          type="submit"
          onClick={handleSubmit}
        >
          Next
        </Button>
      </FormControl>
    </AuthCardLayout>
  );
}

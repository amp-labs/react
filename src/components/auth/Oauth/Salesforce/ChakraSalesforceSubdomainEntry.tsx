import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button, FormControl,
  FormLabel, Heading, Input,
} from '@chakra-ui/react';

import { AuthErrorAlert } from 'components/auth/AuthErrorAlert/AuthErrorAlert';
import { AccessibleLink } from 'components/ui-base/AccessibleLink';
import { AuthCardLayout } from 'src/layout/AuthCardLayout/AuthCardLayout';

import { SALESFORCE_HELP_URL, SubdomainEntryProps } from './SubdomainEntryProps';

/**
 * @deprecated - delete file after removing chakra-ui
 * Salesforce specific subdomain entry component, use workspace entry for other providers.
 * @param param0
 * @returns
 */
export function ChakraSalesforceSubdomainEntry({
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

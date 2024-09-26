import { AuthErrorAlert } from 'components/auth/AuthErrorAlert/AuthErrorAlert';
import { FormComponent } from 'components/form';
import { AccessibleLink } from 'components/ui-base/AccessibleLink';
import { Button } from 'components/ui-base/Button';
import { isChakraRemoved } from 'src/components/ui-base/constant';
import { AuthCardLayout, AuthTitle } from 'src/layout/AuthCardLayout/AuthCardLayout';

import { ChakraSalesforceSubdomainEntry } from './ChakraSalesforceSubdomainEntry';
import { SALESFORCE_HELP_URL, SubdomainEntryProps } from './SubdomainEntryProps';

export function SalesforceSubdomainEntry({
  handleSubmit, setWorkspace, error, isButtonDisabled,
}: SubdomainEntryProps) {
  const props = {
    handleSubmit, setWorkspace, error, isButtonDisabled,
  };
  if (!isChakraRemoved) {
    return <ChakraSalesforceSubdomainEntry {...props} />;
  }

  return (
    <AuthCardLayout>
      <AuthTitle>Enter your Salesforce subdomain</AuthTitle>
      <AccessibleLink href={SALESFORCE_HELP_URL} newTab>
        What is my Salesforce subdomain?
      </AccessibleLink>
      <AuthErrorAlert error={error} />
      <div style={{ display: 'flex', marginTop: '1em' }}>
        <FormComponent.Input
          id="salesforce-subdomain"
          type="text"
          placeholder="MyDomain"
          onChange={(event) => setWorkspace(event.currentTarget.value)}
        />
        <p style={{ lineHeight: '2.2em', marginLeft: '0.4em' }}>.my.salesforce.com</p>
      </div>
      <Button
        style={{ marginTop: '1em', width: '100%' }}
        disabled={isButtonDisabled}
        type="submit"
        onClick={handleSubmit}
      >
        Next
      </Button>
    </AuthCardLayout>
  );
}

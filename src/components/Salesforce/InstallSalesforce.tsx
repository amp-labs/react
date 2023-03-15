/**
 * InstallSalesforce.tsx
 *
 * Component that prompts user to connect Salesforce, connecting subdomain, OAuth, and
 * configuration. Wraps SalesforceSubdomainEntry and ConfigureIntegration.
 */

import { useContext } from 'react';

import SalesforceSubdomainEntry from './SalesforceSubdomainEntry';
import { InstallIntegration } from '../Configure';
import { ProviderConnectionContext } from '../AmpersandProvider';

interface InstallSalesforceProps {
  integration: string;
}

function InstallSalesforce({ integration } : InstallSalesforceProps) {
  const { isConnectedToProvider } = useContext(ProviderConnectionContext);

  if (isConnectedToProvider.salesforce) {
    return (
      <InstallIntegration
        integration={integration}
        api="salesforce"
      />
    );
  }

  return <SalesforceSubdomainEntry />;
}

export default InstallSalesforce;

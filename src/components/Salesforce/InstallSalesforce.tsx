/**
 * InstallSalesforce.tsx
 *
 * Component that prompts user to connect Salesforce, connecting subdomain, OAuth, and
 * configuration. Wraps SalesforceSubdomainEntry and ConfigureIntegration.
 */

import React, { useContext } from 'react';

import SalesforceSubdomainEntry from './SalesforceSubdomainEntry';
import { InstallIntegration } from '../Configure';
import { ProviderConnectionContext } from '../AmpersandProvider';

interface InstallSalesforceProps {
  integration: string;
  redirectUrl?: string;
}

function InstallSalesforce({ integration, redirectUrl = undefined } : InstallSalesforceProps) {
  const { isConnectedToProvider } = useContext(ProviderConnectionContext);

  if (isConnectedToProvider.salesforce) {
    return (
      <InstallIntegration
        integration={integration}
        api="salesforce"
        redirectUrl={redirectUrl}
      />
    );
  }

  return <SalesforceSubdomainEntry />;
}

export default InstallSalesforce;

/**
 * ReconfigureSalesforce.tsx
 *
 * Component that prompts user to reconfigure a Salesforce integration.
 * Wraps SalesforceSubdomainEntry and ConfigureIntegration.
 */

import React, { useContext } from 'react';

import SalesforceSubdomainEntry from './SalesforceSubdomainEntry';
import { ReconfigureIntegration } from '../Configure';
import { ProviderConnectionContext } from '../AmpersandProvider';

interface ReconfigureSalesforceProps {
  integration: string;
  redirectUrl?: string;
}

function ReconfigureSalesforce({
  integration,
  redirectUrl = undefined,
} : ReconfigureSalesforceProps) {
  const { isConnectedToProvider } = useContext(ProviderConnectionContext);

  if (isConnectedToProvider.salesforce) {
    return (
      <ReconfigureIntegration
        integration={integration}
        api="salesforce"
        redirectUrl={redirectUrl}
      />
    );
  }

  return <SalesforceSubdomainEntry />;
}

export default ReconfigureSalesforce;

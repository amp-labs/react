/**
 * ReconfigureSalesforce.tsx
 *
 * Component that prompts user to reconfigure a Salesforce integration.
 * Wraps SalesforceSubdomainEntry and ConfigureIntegration.
 */

import { useContext } from 'react';

import SalesforceSubdomainEntry from './SalesforceSubdomainEntry';
import { ReconfigureIntegration } from '../Configure';
import { ProviderConnectionContext } from '../AmpersandProvider';

interface ReconfigureSalesforceProps {
  integration: string;
}

function ReconfigureSalesforce({ integration } : ReconfigureSalesforceProps) {
  const { isConnectedToProvider } = useContext(ProviderConnectionContext);

  if (isConnectedToProvider.salesforce) {
    return (
      <ReconfigureIntegration
        integration={integration}
        api="salesforce"
      />
    );
  }

  return <SalesforceSubdomainEntry />;
}

export default ReconfigureSalesforce;

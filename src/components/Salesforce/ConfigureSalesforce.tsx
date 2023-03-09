/**
 * ConfigureSalesforce.tsx
 *
 * Component that prompts user to connect Salesforce, connecting subdomain, OAuth, and
 * configuration. Wraps SalesforceSubdomainEntry and ConfigureIntegration.
 */

import { useContext } from 'react';

import SalesforceSubdomainEntry from './SalesforceSubdomainEntry';
import { ConfigureIntegration } from '../Configure';
import { ProviderConnectionContext } from '../AmpersandProvider';

interface ConfigureSalesforceProps {
  integration: string;
  reconfigure?: boolean;
}

function ConfigureSalesforce({ integration, reconfigure = false } : ConfigureSalesforceProps) {
  const { isConnectedToProvider } = useContext(ProviderConnectionContext);

  if (isConnectedToProvider.salesforce) {
    return (
      <ConfigureIntegration
        integration={integration}
        api="salesforce"
        reconfigure={reconfigure}
      />
    );
  }

  return <SalesforceSubdomainEntry />;
}

export default ConfigureSalesforce;

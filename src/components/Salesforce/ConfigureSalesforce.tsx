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
}

function ConfigureSalesforce(props: ConfigureSalesforceProps) {
  const { integration } = props;
  const { isConnectedToProvider } = useContext(ProviderConnectionContext);

  if (isConnectedToProvider.salesforce) {
    return (
      <ConfigureIntegration
        integration={integration}
        api="salesforce"
      />
    );
  }

  return <SalesforceSubdomainEntry />;
}

export default ConfigureSalesforce;

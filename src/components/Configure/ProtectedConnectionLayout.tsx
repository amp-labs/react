import { useEffect } from 'react';

import { PROVIDER_HUBSPOT, PROVIDER_SALESFORCE } from '../../constants';
import { useConnections } from '../../context/ConnectionsContext';
import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { HubspotOauthFlow } from '../Oauth/Hubspot/HubspotOauthFlow';
import { SalesforceOauthFlow } from '../Oauth/Salesforce/SalesforceOauthFlow';

interface ProtectedConnectionLayoutProps {
  provider?: string,
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  children: JSX.Element,
}
export function ProtectedConnectionLayout({
  provider, consumerRef, consumerName, groupRef, groupName, children,
}: ProtectedConnectionLayoutProps) {
  const { selectedConnection, setSelectedConnection, connections } = useConnections();

  useEffect(() => {
    if (!selectedConnection && connections && connections.length > 0) {
      const [connection] = connections;
      setSelectedConnection(connection);
    }
  }, [connections, selectedConnection, setSelectedConnection]);

  const { provider: providerFromProps } = useInstallIntegrationProps();
  if (!provider && !providerFromProps) {
    throw new Error('ProtectedConnectionLayout must be given a provider prop or be used within InstallIntegrationProvider');
  }
  // a selected connection exists, render children
  if (selectedConnection) return children;

  if (provider === PROVIDER_SALESFORCE || providerFromProps === PROVIDER_SALESFORCE) {
    return (
      <SalesforceOauthFlow
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      />
    );
  }

  if (provider === PROVIDER_HUBSPOT || providerFromProps === PROVIDER_HUBSPOT) {
    return (
      <HubspotOauthFlow
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      />
    );
  }

  return (
    <div>Unsupported provider</div>
  );
}

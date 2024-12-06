import { useEffect, useState } from 'react';

import { ApiKeyAuthFlow } from 'components/auth/ApiKeyAuth/ApiKeyAuthFlow';
import { BasicAuthFlow } from 'components/auth/BasicAuth/BasicAuthFlow';
import { NoAuthFlow } from 'components/auth/NoAuth/NoAuthFlow';
import { OauthFlow } from 'components/auth/Oauth/OauthFlow/OauthFlow';
import { useConnectionHandler } from 'components/Connect/useConnectionHandler';
import { useApiKey } from 'context/ApiKeyContextProvider';
import { useConnections } from 'context/ConnectionsContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import { api, ProviderInfo } from 'services/api';
import { capitalize } from 'src/utils';
import { handleServerError } from 'src/utils/handleServerError';

interface ProtectedConnectionLayoutProps {
  provider?: string,
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  onSuccess?: (connectionID: string) => void;
  children: JSX.Element,
  onDisconnectSuccess?: (connectionID: string) => void,
}

export const getProviderInfo = async (
  apiKey: string,
  provider: string,
): Promise<ProviderInfo> => {
  const provInfo = await api()
    .providerApi
    .getProvider({ provider }, {
      headers: { 'X-Api-Key': apiKey ?? '' },
    });
  if (!provInfo) {
    throw new Error(`Provider ${provider} not found`);
  }

  return provInfo;
};

export function ProtectedConnectionLayout({
  provider, consumerRef, consumerName, groupRef, groupName, children, onSuccess, onDisconnectSuccess,
}: ProtectedConnectionLayoutProps) {
  const apiKey = useApiKey();
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);

  const { provider: providerFromProps } = useInstallIntegrationProps();
  const { selectedConnection, setSelectedConnection, connections } = useConnections();
  useConnectionHandler({ onSuccess });

  const selectedProvider = provider || providerFromProps;

  const providerName = providerInfo?.displayName ?? capitalize(selectedProvider);

  useEffect(() => {
    if (!selectedConnection && connections && connections.length > 0) {
      const [connection] = connections;
      setSelectedConnection(connection);
    }

    getProviderInfo(apiKey, selectedProvider).then((info) => {
      setProviderInfo(info);
    }).catch((err) => {
      console.error('Error loading provider info.');
      handleServerError(err);
    });
  }, [connections, selectedConnection, setSelectedConnection, apiKey, selectedProvider]);

  if (!provider && !providerFromProps) {
    throw new Error('ProtectedConnectionLayout must be given a provider prop or be used within InstallIntegrationProvider');
  }

  // a selected connection exists, render children
  if (selectedConnection) return children;

  if (providerInfo == null) return <strong>Provider not found</strong>;

  const sharedProps = {
    provider: selectedProvider,
    consumerRef,
    consumerName,
    groupRef,
    groupName,
    selectedConnection,
    setSelectedConnection,
    providerName,
    providerInfo,
    onDisconnectSuccess,
  };

  if (providerInfo.authType === 'none') {
    return (
      <NoAuthFlow {...sharedProps}>
        {children}
      </NoAuthFlow>
    );
  }

  if (providerInfo.authType === 'basic') {
    return (
      <BasicAuthFlow {...sharedProps}>
        {children}
      </BasicAuthFlow>
    );
  }

  if (providerInfo.authType === 'apiKey') {
    return (
      <ApiKeyAuthFlow {...sharedProps}>
        {children}
      </ApiKeyAuthFlow>
    );
  }

  return (
    <OauthFlow {...sharedProps} />
  );
}

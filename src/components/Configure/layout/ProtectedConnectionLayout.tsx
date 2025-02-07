import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiKeyAuthFlow } from 'components/auth/ApiKeyAuth/ApiKeyAuthFlow';
import { BasicAuthFlow } from 'components/auth/BasicAuth/BasicAuthFlow';
import { NoAuthFlow } from 'components/auth/NoAuth/NoAuthFlow';
import { OauthFlow } from 'components/auth/Oauth/OauthFlow/OauthFlow';
import { useConnectionHandler } from 'components/Connect/useConnectionHandler';
import { useConnections } from 'context/ConnectionsContextProvider';
import {
  useInstallIntegrationProps,
} from 'context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { Connection, useAPI } from 'services/api';
import { SuccessTextBox } from 'src/components/SuccessTextBox/SuccessTextBox';
import { Button } from 'src/components/ui-base/Button';
import { capitalize } from 'src/utils';
import { handleServerError } from 'src/utils/handleServerError';

import { ComponentContainerError, ComponentContainerLoading } from '../ComponentContainer';

interface ProtectedConnectionLayoutProps {
  provider?: string,
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  onSuccess?: (connection: Connection) => void;
  children: JSX.Element,
  onDisconnectSuccess?: (connection: Connection) => void,
  resetComponent: () => void, // resets installation integration component
}

const useProviderInfo = (provider?: string) => {
  const getAPI = useAPI();
  const { provider: providerFromProps } = useInstallIntegrationProps();
  const selectedProvider = provider || providerFromProps;

  return useQuery({
    queryKey: ['amp', 'providerInfo', selectedProvider],
    queryFn: async () => {
      if (!selectedProvider) {
        throw new Error('Provider not found');
      }
      const api = await getAPI();
      return api.providerApi.getProvider({ provider: selectedProvider });
    },
    enabled: !!selectedProvider,
  });
};

export function ProtectedConnectionLayout({
  provider, consumerRef, consumerName, groupRef, groupName, children, onSuccess, onDisconnectSuccess,
  resetComponent,
}: ProtectedConnectionLayoutProps) {
  const {
    data: providerInfo, isLoading: isProviderLoading, isError, error: providerInfoError,
  } = useProviderInfo(provider);
  const { provider: providerFromProps, isIntegrationDeleted } = useInstallIntegrationProps();
  const { selectedConnection, setSelectedConnection } = useConnections();
  useConnectionHandler({ onSuccess });
  const queryClient = useQueryClient();

  const selectedProvider = provider || providerFromProps;

  const providerName = providerInfo?.displayName ?? capitalize(selectedProvider);

  useEffect(() => {
    if (isError) {
      console.error('Error loading provider info.');
      handleServerError(providerInfoError);
    }
  }, [isError, providerInfoError]);

  const reinstallIntegration = useCallback(() => {
    queryClient.clear(); // clears all queries in react-query cache
    resetComponent();
  }, [resetComponent, queryClient]);

  if (!provider && !providerFromProps) {
    throw new Error('ProtectedConnectionLayout must be given a provider prop or be used within InstallIntegrationProvider');
  }

  // integration (and connection) was deleted, show success message with reinstall button
  if (isIntegrationDeleted) {
    return (
      <SuccessTextBox
        text="Integration successfully uninstalled."
      >
        <Button
          type="button"
          onClick={reinstallIntegration}
          style={{ width: '100%' }}
        >Reinstall Integration
        </Button>
      </SuccessTextBox>
    );
  }

  // a selected connection exists, render children
  if (selectedConnection) return children;

  if (isProviderLoading) return <ComponentContainerLoading />;

  if (providerInfo == null) return <ComponentContainerError message="Provider info was not found." />;

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

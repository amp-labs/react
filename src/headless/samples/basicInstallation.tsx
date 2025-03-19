/**
 * @fileoverview
 * This file demonstrates a basic installation of an integration using the Ampersand ConnectProvider.
 * It includes connection management, installation creation, and handling of OAuth flow.
 * It uses the HubSpot integration pre-defined from the builder as an example. (no user inputs)
 *
 * There are two options to create the installation:
 * 1. When the connection is ready (using `whenReady` option).
 *    Connections and Installations hooks manage when the connection is ready
 *    and when the installation can be created.
 * 2. When the connection is established (using `onConnectSuccess` callback).
 *    This allows for more control over when to create the installation.
 */

import {
  ConnectProvider, useConnections, useInstallations, useIsIntegrationInstalled,
} from '@amp-labs/react';
import { ConfigContent } from '@generated/api/src/models/ConfigContent';

import { AmpersandProvider } from 'src/public';

// Sample builder-defined config for the HubSpot integration
const builderConfig: ConfigContent = {
  provider: 'hubspot', // pulled from hydratedRevision
  read: {
    objects: {
      contacts: { // objectName
        objectName: 'contacts',
        selectedFieldsAuto: 'all', // auto-select all fields to be read
        selectedFields: {},
        selectedFieldMappings: {},
        selectedValueMappings: {},
        // schedule: obj.schedule, // pulled from hydratedRevision
        // destination: obj.destination, // pulled from hydratedRevision
        // backfill: obj.backfill // pulled from hydratedRevision,
      },
    },
  },
  write: {}, // add write config if needed
  proxy: {}, // set to true if proxy is enabled
};

function IntegrationComponent() {
  const {
    userId, userName, companyId, orgName,
  } = useInstallationParams(); // hook from InstallationProvider
  const { isLoaded, isIntegrationInstalled } = useIsIntegrationInstalled('my-hubspot-integration', companyId);
  const { createInstallation } = useInstallations();
  const {
    selectedConnection, // first connection of connectionsList
    data: connections,
    isLoading: isConnectionsLoading,
    isError: isConnectionsError,
    error: connectionError,
  } = useConnections();

  const connection = selectedConnection || connections?.[0]; // optional

  // Option 1: create installation when the connection is ready (useEffect)
  createInstallation(
    { config: builderConfig }, // set up builder defined config for the integration
    { whenReady: true }, // attempts to create installation when the connection is ready
  );

  // Option 2: create installation when the connection is established
  const onConnectSuccess = (connectionId: string) => {
    console.log('Connection successful!', { connectionId });
    // Optionally create an installation here if not already created
    if (isLoaded && !isIntegrationInstalled) createInstallation({ config: builderConfig });
  };

  // Custom connection loading, error, and installation state overrides
  if (isConnectionsLoading) return <div>Loading connections...</div>;
  if (isConnectionsError) return <div>Error loading connections: {connectionError.message}</div>;
  if (!isLoaded) return <div>Loading integration...</div>;
  if (connection) return <div>Connection found!</div>;
  if (isIntegrationInstalled) return <div>Integration is already installed!</div>;

  // Use Ampersand Connect Provider to handle OAuth flow and connection management
  return (
    <ConnectProvider
      provider="hubspot" // props optionally taken from InstallationProvider
      consumerRef={userId}
      consumerName={userName}
      groupRef={companyId}
      groupName={orgName}
      // When a user connects their Hubspot via the OAuth flow, we get a connection ID.
      onSuccess={onConnectSuccess}
    />
  );
}

// Sample installation parameters for the InstallationProvider
const installationParams = {
  integration: 'my-hubspot-integration',
  consumerRef: 'user-123', // userId
  groupRef: 'company-456', // companyId
  groupName: 'My Organization', // orgName
};

interface InstallationProviderProps {
  integration: string, // integration name
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  children: React.ReactNode,
}

function InstallationProvider({
  integration,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  children,
}: InstallationProviderProps) {
  // provider logic
//   allow children to useInstallationParams
  return children;
}

export function App() {
  return (
    <AmpersandProvider apiKey="your-api-key" projectId="your-project-id">
      <InstallationProvider {...installationParams}>
        <IntegrationComponent />
      </InstallationProvider>
    </AmpersandProvider>
  );
}

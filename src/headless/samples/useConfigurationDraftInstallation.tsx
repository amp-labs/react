import { useEffect, useState } from 'react';
import {
  ConnectProvider, useConfigFormBuilder, useConfigure,
  useConnections, useInstallationParams,
  useInstallations,
} from '@amp-labs/react';

import { AmpersandProvider } from 'src/public';

// objectname and action may be dynamically set based by builder/user
const SELETECTED_OBJECT_NAME = 'contacts'; // objectName for the integration
const SELECTED_ACTION = 'read'; // action for the integration

function IntegrationComponent() {
  const {
    userId, userName, companyId, orgName,
  } = useInstallationParams(); // hook from InstallationProvider

  // check if there is an established connection to the integration
  const {
    selectedConnection,
    data: connections,
    isLoading: isConnectionsLoading,
    isError: isConnectionsError,
    error: connectionError,
  } = useConnections();
  const connection = selectedConnection || connections?.[0];

  const { createInstallation } = useInstallations();

  // get the from fields needed to form the config
  const configFormBuilder = useConfigFormBuilder();
  const requiredFields = configFormBuilder
    .getRequiredFields({ objectName: SELETECTED_OBJECT_NAME, action: SELECTED_ACTION });
  const optionalFields = configFormBuilder
    .getOptionalFields({ objectName: SELETECTED_OBJECT_NAME, action: SELECTED_ACTION });

  // manage a local state for the configuration
  const config = useConfigure();

  useEffect(() => {
    if (!config.get()) { // check if config is not already initialized
      config.new(); // initialize the config
    }
  }, [config]);

  // sets a selected field for the integration
  const handleFieldChange = (event) => {
    const { name, checked } = event.target;
    config.setDraftSelectedFields({
      objectName: SELETECTED_OBJECT_NAME,
      action: SELECTED_ACTION,
      selectedFields: { [name]: checked },
    });
  };

  const handleCreateInstallation = () => {
    createInstallation({ config: config.get() });
  };

  // handle custom loading, error, and installation UI
  if (isConnectionsLoading) return <div>Loading connections...</div>;
  if (isConnectionsError) return <div>Error loading connections: {connectionError.message}</div>;

  if (!connection) {
    return (
    // Prompt the user to connect their HubSpot account, syncs connection in useConnection on success
      <ConnectProvider
        provider="hubspot"
        consumerRef={userId}
        consumerName={userName}
        groupRef={companyId}
        groupName={orgName}
      />
    );
  }

  // if the connection is established, render the configuration form to gather user inputs
  if (connection) {
    return (
      <div>
        <h2>Configure Your Integration</h2>
        <h3>Required Fields</h3>
        {requiredFields.map((field: HydratedIntegrationField) => (
          <label key={field.fieldName}>{field.mapToDisplayName}</label>
        ))}

        <h3>Optional Fields</h3>
        {optionalFields.map((field) => (
          <label key={field.fieldName}>
            {field.mapToDisplayName}:
            <input
              type="checkbox"
              name={field.fieldName}
              checked={config.get(
                {
                  objectName: 'contacts',
                  action: 'read',
                  selectedFields: field.fieldName,
                },
              ) || false}
              onChange={handleFieldChange}
            />
          </label>
        ))}
        <button type="button" onClick={handleCreateInstallation}>Create Installation</button>
      </div>
    );
  }
}

export function App() {
  return (
    <AmpersandProvider apiKey="your-api-key" projectId="your-project-id">
      <InstallationProvider
        integration="my-hubspot-integration"
        consumerRef="user-123"
        groupRef="company-456"
        groupName="My Organization"
      >
        <IntegrationComponent />
      </InstallationProvider>
    </AmpersandProvider>
  );
}

import { useState } from 'react';
import {
  ConnectProvider, useConfigFormBuilder,
  useConnections, useInstallationParams,
  useInstallations,
} from '@amp-labs/react';
import { HydratedIntegrationField } from '@generated/api/src/models/HydratedIntegrationField';

import { AmpersandProvider } from 'src/public';

function IntegrationComponent() {
  const {
    userId, userName, companyId, orgName,
  } = useInstallationParams(); // hook from InstallationProvider

  const { createInstallation } = useInstallations();
  const {
    selectedConnection,
    data: connections,
    isLoading: isConnectionsLoading,
    isError: isConnectionsError,
    error: connectionError,
  } = useConnections();

  const connection = selectedConnection || connections?.[0];

  const configFormBuilder = useConfigFormBuilder();
  const requiredFields = configFormBuilder.getRequiredFields({ objectName: 'contact', action: 'read' });
  const optionalFields = configFormBuilder.getOptionalFields({ objectName: 'contact', action: 'read' });

  // User-defined configuration state
  const [userConfig, setUserConfig] = useState({
    provider: 'hubspot',
    read: {
      objects: {
        contacts: {
          objectName: 'contacts',
          selectedFields: { ...requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}) },
          // default to all required fields
        },
      },
    },
    write: {},
    proxy: false,
  });

  const handleFieldChange = (event) => {
    const { name, checked } = event.target;
    setUserConfig((prevConfig) => ({
      ...prevConfig,
      read: {
        ...prevConfig.read,
        objects: {
          ...prevConfig.read.objects,
          contacts: {
            ...prevConfig.read.objects.contacts,
            selectedFields: {
              ...prevConfig.read.objects.contacts.selectedFields,
              [name]: checked,
            },
          },
        },
      },
    }));
  };

  const handleCreateInstallation = () => {
    createInstallation({ config: userConfig });
  };

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

  if (connection) return <div>Connection found!</div>;

  return (
    <div>
      <h2>Configure Your Integration</h2>
      <h3>Required Fields</h3>
      {requiredFields.map((field: HydratedIntegrationField) => (
        <label key={field.mapToName}>{field.mapToDisplayName}</label>
      ))}

      <h3>Optional Fields</h3>
      {optionalFields.map((field) => (
        <label key={field.mapToName}>
          {field.mapToDisplayName}:
          <input
            type="checkbox"
            name={field.mapToName}
            checked={userConfig.read.objects.contacts.selectedFields[field] || false}
            onChange={handleFieldChange}
          />
        </label>
      ))}
      <button onClick={handleCreateInstallation}>Create Installation</button>
    </div>
  );
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

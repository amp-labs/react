import { useState } from 'react';
import {
  ConnectProvider, useConnections, useInstallations,
} from '@amp-labs/react';

import { AmpersandProvider } from 'src/public';

// user defined value mappings
const valueMappings = {
  priority: {
    veryhigh: '',
    high: '',
    medium: '',
    low: '',
  },
  status: {
    red: '',
    green: '',
    blue: '',
    yellow: '',
  },
};

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

  // User-defined configuration state
  // locally manage your own state for the configuration
  const [userConfig, setUserConfig] = useState({
    provider: 'hubspot',
    read: {
      objects: {
        contacts: {
          objectName: 'contacts',
          selectedFieldsAuto: 'all',
          selectedFields: {},
          selectedFieldMappings: {},
          selectedValueMappings: valueMappings,
        },
      },
    },
    write: {},
    proxy: false,
  });

  const handleConfigChange = (event) => {
    const { name, value } = event.target;
    const [category, key] = name.split('.');
    setUserConfig((prevConfig) => ({
      ...prevConfig,
      read: {
        ...prevConfig.read,
        objects: {
          ...prevConfig.read.objects,
          contacts: {
            ...prevConfig.read.objects.contacts,
            selectedValueMappings: {
              ...prevConfig.read.objects.contacts.selectedValueMappings,
              [category]: {
                ...prevConfig.read.objects.contacts.selectedValueMappings[category],
                [key]: value,
              },
            },
          },
        },
      },
    }));
  };

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

  const handleFieldMappingChange = (event) => {
    const { name, value } = event.target;
    setUserConfig((prevConfig) => ({
      ...prevConfig,
      read: {
        ...prevConfig.read,
        objects: {
          ...prevConfig.read.objects,
          contacts: {
            ...prevConfig.read.objects.contacts,
            selectedFieldMappings: {
              ...prevConfig.read.objects.contacts.selectedFieldMappings,
              [name]: value,
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

  if (connection) {
    return (
      <div>
        <h2>Configure Your Integration</h2>
        <h3>Selected Fields </h3>
        {['field1', 'field2', 'field3'].map((field) => (
          <label key={field}>
            {field}:
            <input
              type="checkbox"
              name={field}
              checked={userConfig.read.objects.contacts.selectedFields[field] || false}
              onChange={handleFieldChange}
            />
          </label>
        ))}
        <h3>Field Mappings</h3>
        {['field1', 'field2', 'field3'].map((field) => (
          <label key={field}>
            {field} Mapping:
            <input
              type="text"
              name={field}
              value={userConfig.read.objects.contacts.selectedFieldMappings[field] || ''}
              onChange={handleFieldMappingChange}
            />
          </label>
        ))}
        <h3>Set Priority Mappings</h3>
        {Object.entries(valueMappings).map(([category, mappings]) => (
          <div key={category}>
            <h4>{category}</h4>
            {Object.keys(mappings).map((key) => (
              <label key={key}>
                {key}:
                <select
                  name={`${category}.${key}`}
                  value={userConfig.read.objects.contacts.selectedValueMappings[category][key] || ''}
                  onChange={handleConfigChange}
                >
                  <option value="">Select a value</option>
                  <option value="user_selected_value_1">User Selected Value 1</option>
                  <option value="user_selected_value_2">User Selected Value 2</option>
                  <option value="user_selected_value_3">User Selected Value 3</option>
                  <option value="user_selected_value_4">User Selected Value 4</option>
                </select>
              </label>
            ))}
          </div>
        ))}
        <button type="button" onClick={handleCreateInstallation}>Create Installation</button>
      </div>
    );
  }
}

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

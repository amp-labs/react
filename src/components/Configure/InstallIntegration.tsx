import { useState } from 'react';

import { ErrorTextBox } from 'components/ErrorTextBox/ErrorTextBox';
import { ConnectionsProvider } from 'context/ConnectionsContextProvider';
import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { InstallIntegrationProvider } from 'context/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { Config } from 'services/api';

import { InstallationContent } from './content/InstallationContent';
import { ConditionalProxyLayout } from './layout/ConditionalProxyLayout/ConditionalProxyLayout';
import { ProtectedConnectionLayout } from './layout/ProtectedConnectionLayout';
import { ObjectManagementNav } from './nav/ObjectManagementNav';
import { ConfigurationProvider } from './state/ConfigurationStateProvider';
import { HydratedRevisionProvider } from './state/HydratedRevisionContext';

// creates a random seed to force update the component
// pass the seed as a key to the component
function useForceUpdate() {
  const [seed, setSeed] = useState(1);
  const reset = () => { setSeed(Math.random()); };

  return { seed, reset };
}

interface InstallIntegrationProps {
  integration: string, // integration name
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  onInstallSuccess?: (installationId: string, config: Config) => void,
  onUpdateSuccess?: (installationId: string, config: Config) => void,
  onUninstallSuccess?: (installationId: string) => void,
}

export function InstallIntegration(
  {
    integration, consumerRef, consumerName, groupRef, groupName, onInstallSuccess, onUpdateSuccess,
    onUninstallSuccess,
  }: InstallIntegrationProps,
) {
  const { projectId } = useProject();
  const { errorState } = useErrorState();
  const { seed, reset } = useForceUpdate();

  if (errorState[ErrorBoundary.INTEGRATION_LIST]?.apiError) {
    return <ErrorTextBox message="Something went wrong, couldn't find integration information" />;
  }

  return (
    // install integration provider provides all props, integrationObj and installation
    <InstallIntegrationProvider
      key={seed} // force update when seed changes
      integration={integration}
      consumerRef={consumerRef}
      consumerName={consumerName}
      groupRef={groupRef}
      groupName={groupName}
      onInstallSuccess={onInstallSuccess}
      onUpdateSuccess={onUpdateSuccess}
      onUninstallSuccess={onUninstallSuccess}
    >
      <ConnectionsProvider groupRef={groupRef}>
        <ProtectedConnectionLayout
          consumerRef={consumerRef}
          consumerName={consumerName}
          groupRef={groupRef}
          groupName={groupName}
        >
          <HydratedRevisionProvider projectId={projectId}>
            <ConditionalProxyLayout resetComponent={reset}>
              <ConfigurationProvider>
                <ObjectManagementNav>
                  <InstallationContent />
                </ObjectManagementNav>
              </ConfigurationProvider>
            </ConditionalProxyLayout>
          </HydratedRevisionProvider>
        </ProtectedConnectionLayout>
      </ConnectionsProvider>
    </InstallIntegrationProvider>
  );
}

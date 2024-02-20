import { ConnectionsProvider } from '../../context/ConnectionsContextProvider';
import { ErrorBoundary, useErrorState } from '../../context/ErrorContextProvider';
import { InstallIntegrationProvider } from '../../context/InstallIntegrationContextProvider';
import { useProject } from '../../context/ProjectContextProvider';
import { Config } from '../../services/api';
import { ErrorTextBox } from '../ErrorTextBox';

import { ConfigureInstallation } from './ConfigureInstallation/ConfigureInstallation';
import { HydratedRevisionProvider } from './context/HydratedRevisionContextProvider';
import { ProtectedConnectionLayout } from './layout/ProtectedConnectionLayout';

interface InstallIntegrationProps {
  integration: string, // integration name
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  onInstallSuccess?: (installationId: string, config: Config) => void,
  onUpdateSuccess?: (installationId: string, config: Config) => void,
}

export function InstallIntegration(
  {
    integration, consumerRef, consumerName, groupRef, groupName, onInstallSuccess, onUpdateSuccess,
  }: InstallIntegrationProps,
) {
  const { projectId } = useProject();
  const { errorState } = useErrorState();
  if (errorState[ErrorBoundary.INTEGRATION_LIST]?.apiError) {
    return <ErrorTextBox message="Something went wrong, couldn't find integration information" />;
  }

  return (
    // install integration provider provides all props, integrationObj and installation
    <InstallIntegrationProvider
      integration={integration}
      consumerRef={consumerRef}
      consumerName={consumerName}
      groupRef={groupRef}
      groupName={groupName}
      onInstallSuccess={onInstallSuccess}
      onUpdateSuccess={onUpdateSuccess}
    >
      <ConnectionsProvider groupRef={groupRef}>
        <ProtectedConnectionLayout
          consumerRef={consumerRef}
          consumerName={consumerName}
          groupRef={groupRef}
          groupName={groupName}
        >
          <HydratedRevisionProvider projectId={projectId}>
            <ConfigureInstallation />
          </HydratedRevisionProvider>
        </ProtectedConnectionLayout>
      </ConnectionsProvider>
    </InstallIntegrationProvider>
  );
}

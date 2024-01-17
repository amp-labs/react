import { ConnectionsProvider } from '../../context/ConnectionsContext';
import { ErrorBoundary, useErrorState } from '../../context/ErrorContextProvider';
import { InstallIntegrationProvider } from '../../context/InstallIntegrationContext';
import { useProject } from '../../context/ProjectContext';
import { ErrorTextBox } from '../ErrorTextBox';

import { InstallationContent } from './content/InstallationContent';
import { ConfigurationProvider } from './state/ConfigurationStateProvider';
import { HydratedRevisionProvider } from './state/HydratedRevisionContext';
import { ObjectManagementNav } from './ObjectManagementNav';
import { ProtectedConnectionLayout } from './ProtectedConnectionLayout';

interface InstallIntegrationProps {
  integration: string, // integration name
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
}

export function InstallIntegration(
  {
    integration, consumerRef, consumerName, groupRef, groupName,
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
    >
      <ConnectionsProvider groupRef={groupRef}>
        <ProtectedConnectionLayout
          consumerRef={consumerRef}
          consumerName={consumerName}
          groupRef={groupRef}
          groupName={groupName}
        >
          <HydratedRevisionProvider projectId={projectId}>
            <ConfigurationProvider>
              <ObjectManagementNav>
                <InstallationContent />
              </ObjectManagementNav>
            </ConfigurationProvider>
          </HydratedRevisionProvider>
        </ProtectedConnectionLayout>
      </ConnectionsProvider>
    </InstallIntegrationProvider>
  );
}

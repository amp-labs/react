import { ConnectionsProvider } from '../../context/ConnectionsContext';
import { HydratedRevisionProvider } from '../../context/HydratedRevisionContext';
import { InstallIntegrationProvider, useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { useProject } from '../../context/ProjectContext';

import { ConfigurationProvider } from './state/ConfigurationStateProvider';
import { ErrorBoundary, useErrorState } from './state/ErrorStateProvider';
import { CreateInstallation } from './CreateInstallation';
import { ErrorTextBoxPlaceholder } from './ErrorTextBoxPlaceholder';
import { ObjectManagementNav } from './ObjectManagementNav';
import { ProtectedConnectionLayout } from './ProtectedConnectionLayout';
import { UpdateInstallation } from './UpdateInstallation';

// todo : add the install integration provider to supply these properties
function InstallationContent() {
  const { integrationObj, installation } = useInstallIntegrationProps();

  if (!integrationObj) {
    return <ErrorTextBoxPlaceholder message={"We can't load the integration"} />;
  }

  return installation && integrationObj ? (
    // If installation exists, render update installation flow
    <UpdateInstallation
      installation={installation}
      integrationObj={integrationObj}
    />
  ) : (
    // No installation, render create installation flow
    <CreateInstallation />
  );
}

interface InstallIntegrationProps {
  integration: string, // integration name
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
}

// TODO consider creating an integration obj context
export function InstallIntegration(
  {
    integration, consumerRef, consumerName, groupRef, groupName,
  }: InstallIntegrationProps,
) {
  const { projectId } = useProject();
  const { errorState } = useErrorState();
  if (errorState[ErrorBoundary.INTEGRATION_LIST]?.apiError) {
    console.log('asdlaskdjasldkjasdlkasjdlas');
    return <ErrorTextBoxPlaceholder message="Something went wrong, couldn't find integration information" />;
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
      <ConnectionsProvider projectId={projectId}>
        <ProtectedConnectionLayout>
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

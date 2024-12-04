import { useState } from 'react';

import { ErrorTextBox } from 'components/ErrorTextBox/ErrorTextBox';
import { ConnectionsProvider } from 'context/ConnectionsContextProvider';
import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { InstallIntegrationProvider } from 'context/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { Config, IntegrationFieldMapping } from 'services/api';
import resetStyles from 'src/styles/resetCss.module.css';

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

export type FieldMapping = { [key: string]: Array<IntegrationFieldMapping> };

interface InstallIntegrationProps {
  /**
   * The name of the integration from amp.yaml
   */
  integration: string,
  /**
   *  The ID that your app uses to identify this end user.
   */
  consumerRef: string,
  /**
   *  The display name that your app uses for this end user.
   */
  consumerName?: string,
  /**
   *  The ID that your app uses to identify the user's company, org, or team.
   */
  groupRef: string,
  /**
   *  The display name that your app uses for this company, org or team.
   */
  groupName?: string,
  /**
   * Dynamic field mappings that need to be filled out by a consumer.
   * @experimental
   */
  fieldMapping?: FieldMapping,
  onInstallSuccess?: (installationId: string, config: Config) => void,
  onUpdateSuccess?: (installationId: string, config: Config) => void,
  onUninstallSuccess?: (installationId: string) => void,
}

export function InstallIntegration(
  {
    integration, consumerRef, consumerName, groupRef, groupName, onInstallSuccess, onUpdateSuccess,
    onUninstallSuccess, fieldMapping,
  }: InstallIntegrationProps,
) {
  const { projectId } = useProject();
  const { errorState } = useErrorState();
  const { seed, reset } = useForceUpdate();

  if (errorState[ErrorBoundary.INTEGRATION_LIST]?.apiError) {
    return <ErrorTextBox message="Something went wrong, couldn't find integration information" />;
  }

  return (
    <div className={resetStyles.resetContainer}>
      {/* install integration provider provides all props, integrationObj and installation */}
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
        fieldMapping={fieldMapping}
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
    </div>
  );
}

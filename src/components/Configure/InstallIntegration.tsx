import { ConnectionsProvider } from "context/ConnectionsContextProvider";
import { ErrorBoundary, useErrorState } from "context/ErrorContextProvider";
import { InstallIntegrationProvider } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Config } from "services/api";
import { InstallationProvider } from "src/headless";
import { useListIntegrationsQuery } from "src/hooks/query";
import { useProjectQuery } from "src/hooks/query";
import { useForceUpdate } from "src/hooks/useForceUpdate";
import type { DynamicFieldMappingEntry } from "services/api";

import {
  ComponentContainerError,
  ComponentContainerLoading,
} from "./ComponentContainer";
import { InstallationContent } from "./content/InstallationContent";
import { ConditionalHasConfigurationLayout } from "./layout/ConditionalHasConfigurationLayout/ConditionalHasConfigurationLayout";
import { ProtectedConnectionLayout } from "./layout/ProtectedConnectionLayout";
import { ObjectManagementNav } from "./nav/ObjectManagementNav";
import { ConfigurationProvider } from "./state/ConfigurationStateProvider";
import { HydratedRevisionProvider } from "./state/HydratedRevisionContext";

import resetStyles from "src/styles/resetCss.module.css";

/**
 * A map of object names to FieldMappingEntry arrays, with each FieldMappingEntry representing a field.
 */
export type FieldMapping = {
  [key: string]: Array<DynamicFieldMappingEntry>;
};

interface InstallIntegrationProps {
  /**
   * The name of the integration from amp.yaml
   */
  integration: string;
  /**
   *  The ID that your app uses to identify this end user.
   */
  consumerRef: string;
  /**
   *  The display name that your app uses for this end user.
   */
  consumerName?: string;
  /**
   *  The ID that your app uses to identify the user's company, org, or team.
   */
  groupRef: string;
  /**
   *  The display name that your app uses for this company, org or team.
   */
  groupName?: string;
  /**
   * Dynamic field mappings that need to be filled out by a consumer.
   * @experimental
   */
  fieldMapping?: FieldMapping;
  onInstallSuccess?: (installationId: string, config: Config) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
  onUninstallSuccess?: (installationId: string) => void;
}

const InstallIntegrationContent = ({
  integration,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  onInstallSuccess,
  onUpdateSuccess,
  onUninstallSuccess,
  fieldMapping,
}: InstallIntegrationProps) => {
  const { projectIdOrName, isLoading: isProjectLoading } = useProjectQuery();
  const { isLoading: isIntegrationListLoading } = useListIntegrationsQuery();
  const { isError, errorState } = useErrorState();
  const { seed, reset } = useForceUpdate();

  if (isProjectLoading || isIntegrationListLoading) {
    return <ComponentContainerLoading />;
  }

  if (isError(ErrorBoundary.PROJECT, projectIdOrName)) {
    // set in ProjectContextProvider (AmpersandProvider)
    return (
      <ComponentContainerError
        message={`Error loading project ${projectIdOrName}`}
      />
    );
  }

  // set in IntegrationListContextProvider (AmpersandProvider)
  if (isError(ErrorBoundary.INTEGRATION_LIST, projectIdOrName)) {
    return (
      <ComponentContainerError message="Error retrieving integrations for the project, double check the API key" />
    );
  }

  if (errorState[ErrorBoundary.INTEGRATION_LIST]?.apiError) {
    return (
      <ComponentContainerError message="Something went wrong, couldn't find integration information" />
    );
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
        resetComponent={reset}
      >
        <ConnectionsProvider>
          <ProtectedConnectionLayout
            consumerRef={consumerRef}
            consumerName={consumerName}
            groupRef={groupRef}
            groupName={groupName}
            resetComponent={reset}
          >
            <HydratedRevisionProvider resetComponent={reset}>
              <ConditionalHasConfigurationLayout>
                <ConfigurationProvider>
                  <ObjectManagementNav>
                    <InstallationContent />
                  </ObjectManagementNav>
                </ConfigurationProvider>
              </ConditionalHasConfigurationLayout>
            </HydratedRevisionProvider>
          </ProtectedConnectionLayout>
        </ConnectionsProvider>
      </InstallIntegrationProvider>
    </div>
  );
};

export function InstallIntegration({
  integration,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  onInstallSuccess,
  onUpdateSuccess,
  onUninstallSuccess,
  fieldMapping,
}: InstallIntegrationProps) {
  const props: InstallIntegrationProps = {
    integration,
    consumerRef,
    consumerName,
    groupRef,
    groupName,
    onInstallSuccess,
    onUpdateSuccess,
    onUninstallSuccess,
    fieldMapping,
  };

  return (
    // eventually will use the headless providers for integration, consumer, and group etc
    <InstallationProvider
      integration={integration}
      consumerRef={consumerRef}
      consumerName={consumerName}
      groupRef={groupRef}
      groupName={groupName}
    >
      <InstallIntegrationContent {...props} />
    </InstallationProvider>
  );
}

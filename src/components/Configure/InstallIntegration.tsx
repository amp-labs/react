import { ConnectionsProvider } from "context/ConnectionsContextProvider";
import { ErrorBoundary, useErrorState } from "context/ErrorContextProvider";
import { InstallIntegrationProvider } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useProject } from "context/ProjectContextProvider";
import { Config } from "services/api";
import { useIntegrationList } from "src/context/IntegrationListContextProvider";
import { useForceUpdate } from "src/hooks/useForceUpdate";

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

export interface MappedValue {
  mappedValue: string;
  mappedDisplayValue: string;
}

export type FieldMappingEntry = {
  /**
   * The name of the field in your application.
   */
  mapToName: string;
  /**
   * Optional display name of the field to show the user in the mapping UI.
   */
  mapToDisplayName?: string;
  /**
   * Optional prompt to show the user in the mapping UI.
   */
  prompt?: string;
  /**
   * If you would like the user to map a set of possible values,
   * this is the list of possible values of the field in your application.
   */
  mappedValues?: MappedValue[];
  /**
   * The name of the field in SaaS provider, if present, then we will not prompt the user to map the field.
   */
  fieldName?: string;
};

/**
 * A map of object names to FieldMappingEntry arrays, with each FieldMappingEntry representing a field.
 */
export type FieldMapping = {
  [key: string]: Array<FieldMappingEntry>;
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
  const { projectIdOrName, isLoading: isProjectLoading } = useProject();
  const { isLoading: isIntegrationListLoading } = useIntegrationList();
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
}

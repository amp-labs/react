import type { DynamicMappingsInputEntry } from "services/api";
import { Config } from "services/api";
import { InstallationProvider } from "src/headless";
import { useListIntegrationsQuery } from "src/hooks/query";
import { useProjectQuery } from "src/hooks/query";

import { ComponentContainerLoading } from "./ComponentContainer";
import { InstallationContentV2 } from "./content/InstallationContentV2";
import { ProtectedInstallationContent } from "./content/ProtectedInstallationContent";
import { InstallIntegrationErrorBoundary } from "./ErrorBoundary";

import resetStyles from "src/styles/resetCss.module.css";

/**
 * A map of object names to DynamicMappingsInputEntry arrays, with each DynamicMappingsInputEntry representing a field.
 */
export type FieldMapping = {
  [key: string]: Array<DynamicMappingsInputEntry>;
};

interface InstallIntegrationV2Props {
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

const InstallIntegrationContentV2 = ({
  integration,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  onInstallSuccess,
  onUpdateSuccess,
  onUninstallSuccess,
  fieldMapping,
}: InstallIntegrationV2Props) => {
  const { isLoading: isProjectLoading } = useProjectQuery();
  const { isLoading: isIntegrationListLoading } = useListIntegrationsQuery();

  // Show loading state while queries are pending
  if (isProjectLoading || isIntegrationListLoading) {
    return <ComponentContainerLoading />;
  }

  // V2 Philosophy: Let errors bubble up to InstallIntegrationErrorBoundary
  // instead of handling them inline. This simplifies the component and
  // provides a consistent error experience.

  return (
    <div className={resetStyles.resetContainer}>
      {/* V2: Simplified provider structure - using headless InstallationProvider */}
      <InstallationProvider
        integration={integration}
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      >
        {/* ProtectedInstallationContent handles authentication */}
        <ProtectedInstallationContent>
          <InstallationContentV2
            onInstallSuccess={onInstallSuccess}
            onUpdateSuccess={onUpdateSuccess}
            onUninstallSuccess={onUninstallSuccess}
            fieldMapping={fieldMapping}
          />
        </ProtectedInstallationContent>
      </InstallationProvider>
    </div>
  );
};

/**
 * InstallIntegrationV2 - Experimental headless version
 *
 * This is a redesigned version of InstallIntegration that:
 * - Uses headless hooks directly instead of legacy context providers
 * - Has a simplified provider hierarchy (2-3 levels vs 10+)
 * - Includes AI-powered smart suggestions and contextual help
 * - Provides a cleaner API and better developer experience
 * - Relies on error boundaries for consistent error handling
 *
 * Error Handling Strategy:
 * - All errors bubble up to InstallIntegrationErrorBoundary
 * - The error boundary shows the error message automatically
 * - No need for inline error handling (except loading states)
 * - Simpler code, easier to maintain
 *
 * @experimental This component is in active development
 */
export function InstallIntegrationV2({
  integration,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  onInstallSuccess,
  onUpdateSuccess,
  onUninstallSuccess,
  fieldMapping,
}: InstallIntegrationV2Props) {
  return (
    // Error boundary will catch all errors and display error.message
    <InstallIntegrationErrorBoundary>
      <InstallIntegrationContentV2
        integration={integration}
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
        onInstallSuccess={onInstallSuccess}
        onUpdateSuccess={onUpdateSuccess}
        onUninstallSuccess={onUninstallSuccess}
        fieldMapping={fieldMapping}
      />
    </InstallIntegrationErrorBoundary>
  );
}

import { Config } from "services/api";
import { useInstallation } from "src/headless/installation/useInstallation";
import { useInstallationProps } from "src/headless/InstallationProvider";
import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";

import { ComponentContainerLoading } from "../ComponentContainer";
import { FieldMapping } from "../InstallIntegrationV2";

import { UpdateInstallation } from "./UpdateInstallation";
import { CreateInstallationWizard } from "./wizard/CreateInstallationWizard";

interface InstallationContentV2Props {
  onInstallSuccess?: (installationId: string, config: Config) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
  onUninstallSuccess?: (installationId: string) => void;
  fieldMapping?: FieldMapping;
}

/**
 * InstallationContentV2 - Headless version of InstallationContent
 *
 * Key differences from V1:
 * - Uses headless hooks (useInstallation, useIntegrationQuery) instead of context
 * - No dependency on InstallIntegrationProvider
 * - Simpler data flow and state management
 * - Easier to test and reason about
 *
 * Building this up piecewise to verify each step works.
 *
 * @experimental This component is in active development
 */
export function InstallationContentV2(_props: InstallationContentV2Props) {
  // V2: Get data from headless hooks instead of context
  const { integrationNameOrId } = useInstallationProps();
  const { installation, isPending: isInstallationPending } = useInstallation();
  const {
    data: integrationObj,
    isPending: isIntegrationPending,
    isError: isIntegrationError,
  } = useIntegrationQuery(integrationNameOrId);

  // Show loading state while fetching data
  if (isInstallationPending || isIntegrationPending) {
    return <ComponentContainerLoading />;
  }

  // Throw errors to be caught by error boundary
  if (isIntegrationError) {
    throw new Error("Failed to load integration information");
  }

  if (!integrationObj) {
    throw new Error(`Integration "${integrationNameOrId}" not found`);
  }

  // Note: Authentication is handled by ProtectedInstallationContent wrapper
  // So we can assume connection exists at this point

  // Route to appropriate flow based on installation state
  if (installation) {
    // Installation exists - show update flow
    // return <UpdateInstallation installation={installation} />;
    return <div>Update Installation</div>;
  }

  // No installation - show create wizard
  return <CreateInstallationWizard onSuccess={_props.onInstallSuccess} />;
}

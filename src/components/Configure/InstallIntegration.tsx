import { useEffect, useRef, useState } from "react";
import { ConnectionsProvider } from "context/ConnectionsContextProvider";
import { ErrorBoundary, useErrorState } from "context/ErrorContextProvider";
import { InstallIntegrationProvider } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import type { DynamicMappingsInputEntry } from "services/api";
import { Config } from "services/api";
import { InstallationProvider, useInstallation } from "src/headless";
import { useListIntegrationsQuery } from "src/hooks/query";
import { useProjectQuery } from "src/hooks/query";
import { useForceUpdate } from "src/hooks/useForceUpdate";
import type { SubscribeConfigByObject } from "src/types/subscribeConfig";

import { InstallWizard } from "../InstallWizard/InstallWizard";

import {
  ComponentContainerError,
  ComponentContainerLoading,
} from "./ComponentContainer";
import { InstallationContent } from "./content/InstallationContent";
import { AmpersandErrorBoundary } from "./ErrorBoundary";
// eslint-disable-next-line max-len
import { ConditionalHasConfigurationLayout } from "./layout/ConditionalHasConfigurationLayout/ConditionalHasConfigurationLayout";
import { ProtectedConnectionLayout } from "./layout/ProtectedConnectionLayout";
import { ObjectManagementNav } from "./nav/ObjectManagementNav";
import { ConfigurationProvider } from "./state/ConfigurationStateProvider";
import { HydratedRevisionProvider } from "./state/HydratedRevisionContext";

import resetStyles from "src/styles/resetCss.module.css";

/**
 * A map of object names to DynamicMappingsInputEntry arrays, with each DynamicMappingsInputEntry representing a field.
 */
export type FieldMapping = {
  [key: string]: Array<DynamicMappingsInputEntry>;
};

export interface InstallIntegrationProps {
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
  /**
   * Subscribe config per object name, in the installation API's shape, written to the
   * installation's `subscribe.objects` without asking the consumer. The key supplies
   * `objectName`; `destination` may be omitted, and the server then takes the object's
   * `amp.yaml` destination.
   *
   * An event left out is left out of the installation, so the manifest decides it. An omitted
   * `inheritFieldsAndMappings` takes the manifest's `inheritFieldsAndMapping`. A non-inheriting
   * object must name the fields its events deliver in `selectedFields` or
   * `selectedFieldMappings`, and an update event set to `always` must list
   * `requiredWatchFields`; the server rejects an object that does not. `requiredWatchFields`
   * decide which changes fire an update event and are not delivered unless also selected.
   *
   * Applied only in wizard mode. In the standard flow, an integration with subscribe objects
   * and no read or write objects shows an error instead of installing.
   *
   * @experimental
   */
  subscribeConfig?: SubscribeConfigByObject;
  onInstallSuccess?: (installationId: string, config: Config) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
  onUninstallSuccess?: (installationId: string) => void;
}

/**
 * Internal props that extend the public props with the variant option.
 * This is not exported from the public API.
 */
interface InstallIntegrationInternalProps extends InstallIntegrationProps {
  /**
   * When "wizard", uses the new wizard-based install flow for new installations.
   * Existing installations still show the standard configuration view.
   */
  variant?: "wizard";
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
  subscribeConfig,
  variant,
}: InstallIntegrationInternalProps) => {
  const { installation, isPending: isInstallationPending } = useInstallation();
  const { projectIdOrName, isLoading: isProjectLoading } = useProjectQuery();
  const { isLoading: isIntegrationListLoading } = useListIntegrationsQuery();
  const { isError, errorState } = useErrorState();
  const { seed, reset } = useForceUpdate();

  // Once we enter wizard mode, stay in it until the user explicitly exits
  const enteredWizardMode = useRef(false);
  const [wizardDismissed, setWizardDismissed] = useState(false);
  const prevSeedRef = useRef(seed);

  // Reset wizard state when component is reset (e.g., after uninstall)
  useEffect(() => {
    if (prevSeedRef.current !== seed) {
      prevSeedRef.current = seed;
      setWizardDismissed(false);
    }
  }, [seed]);

  // Lock into wizard mode once we detect no installation
  useEffect(() => {
    if (variant === "wizard" && !installation && !isInstallationPending) {
      enteredWizardMode.current = true;
    }
  }, [variant, installation, isInstallationPending]);

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

  // Stay in wizard mode until user clicks "Edit Configuration"
  if (enteredWizardMode.current && !wizardDismissed) {
    return (
      <InstallWizard
        key={seed + 1} // force update when seed changes
        integration={integration}
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
        fieldMapping={fieldMapping}
        subscribeConfig={subscribeConfig}
        onInstallSuccess={onInstallSuccess}
        onUpdateSuccess={onUpdateSuccess}
        onUninstallSuccess={onUninstallSuccess}
        onEditConfiguration={() => setWizardDismissed(true)}
      />
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

export function InstallIntegration(props: InstallIntegrationProps) {
  const { integration, consumerRef, consumerName, groupRef, groupName } = props;

  return (
    // catch errors in the InstallIntegrationContent component
    <AmpersandErrorBoundary
      fallback={
        <ComponentContainerError message="Something went wrong, couldn't find integration information" />
      }
    >
      {/* eventually will use the headless providers for integration, consumer, and group etc */}
      <InstallationProvider
        integration={integration}
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      >
        <InstallIntegrationContent
          {...(props as InstallIntegrationInternalProps)}
        />
      </InstallationProvider>
    </AmpersandErrorBoundary>
  );
}

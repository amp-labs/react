import { ConnectionsProvider } from "context/ConnectionsContextProvider";
import { InstallIntegrationProvider } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Config } from "services/api";
import { InstallationProvider } from "src/headless";
import { useListIntegrationsQuery } from "src/hooks/query";
import { useProjectQuery } from "src/hooks/query";
import { useForceUpdate } from "src/hooks/useForceUpdate";

import {
  ComponentContainerError,
  ComponentContainerLoading,
} from "../Configure/ComponentContainer";
import { AmpersandErrorBoundary } from "../Configure/ErrorBoundary";

import { ConfigureObjectsGate } from "./steps/configure-objects";
import { ConnectStep } from "./steps/ConnectStep";
import { ReviewStep } from "./steps/ReviewStep";
import { SelectObjectsStep } from "./steps/SelectObjectsStep";
import { SuccessStep } from "./steps/SuccessStep";
import { WizardProvider } from "./wizard/WizardContext";
import { WizardStep } from "./wizard/WizardContext";
import { WizardLayout, WizardStepContainer } from "./wizard/WizardLayout";

import styles from "./installWizard.module.css";
import resetStyles from "src/styles/resetCss.module.css";

export type FieldMapping = {
  [key: string]: Array<import("services/api").DynamicMappingsInputEntry>;
};

interface InstallWizardProps {
  integration: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  fieldMapping?: FieldMapping;
  onInstallSuccess?: (installationId: string, config: Config) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
  onUninstallSuccess?: (installationId: string) => void;
  onEditConfiguration?: () => void;
}

const InstallWizardContent = ({
  integration,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  onInstallSuccess,
  onUpdateSuccess,
  onUninstallSuccess,
  fieldMapping,
  onEditConfiguration,
}: InstallWizardProps) => {
  const {
    projectIdOrName,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useProjectQuery();
  const {
    isLoading: isIntegrationListLoading,
    isError: isIntegrationListError,
  } = useListIntegrationsQuery();
  const { seed, reset } = useForceUpdate();

  if (isProjectLoading || isIntegrationListLoading) {
    return <ComponentContainerLoading />;
  }

  if (isProjectError) {
    return (
      <ComponentContainerError
        message={`Error loading project ${projectIdOrName}`}
      />
    );
  }

  if (isIntegrationListError) {
    return (
      <ComponentContainerError message="Error retrieving integrations for the project, double check the API key" />
    );
  }

  return (
    <div className={resetStyles.resetContainer}>
      <InstallIntegrationProvider
        key={seed}
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
          <WizardProvider>
            <div className={styles.installWizard}>
              <WizardLayout>
                <WizardStepContainer step={WizardStep.Connect}>
                  <ConnectStep
                    consumerRef={consumerRef}
                    consumerName={consumerName}
                    groupRef={groupRef}
                    groupName={groupName}
                    resetComponent={reset}
                  />
                </WizardStepContainer>
                <WizardStepContainer step={WizardStep.SelectObjects}>
                  <SelectObjectsStep />
                </WizardStepContainer>
                <WizardStepContainer step={WizardStep.ConfigureObjects}>
                  <ConfigureObjectsGate />
                </WizardStepContainer>
                <WizardStepContainer step={WizardStep.Review}>
                  <ReviewStep />
                </WizardStepContainer>
                <WizardStepContainer step={WizardStep.Success}>
                  <SuccessStep onEditConfiguration={onEditConfiguration} />
                </WizardStepContainer>
              </WizardLayout>
            </div>
          </WizardProvider>
        </ConnectionsProvider>
      </InstallIntegrationProvider>
    </div>
  );
};

export function InstallWizard(props: InstallWizardProps) {
  return (
    <AmpersandErrorBoundary
      fallback={
        <ComponentContainerError message="Something went wrong, couldn't find integration information" />
      }
    >
      <InstallationProvider
        integration={props.integration}
        consumerRef={props.consumerRef}
        consumerName={props.consumerName}
        groupRef={props.groupRef}
        groupName={props.groupName}
      >
        <InstallWizardContent {...props} />
      </InstallationProvider>
    </AmpersandErrorBoundary>
  );
}

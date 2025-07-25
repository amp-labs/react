import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListInstallationsQuery } from "hooks/query/useListInstallationsQuery";
import { Config, Installation, Integration } from "services/api";
import {
  ComponentContainerError,
  ComponentContainerLoading,
} from "src/components/Configure/ComponentContainer";
import { FieldMapping } from "src/components/Configure/InstallIntegration";
import { findIntegrationFromList } from "src/utils";
import { handleServerError } from "src/utils/handleServerError";

import { ErrorBoundary, useErrorState } from "../ErrorContextProvider";
import { useIntegrationList } from "../IntegrationListContextProvider";

import { useIsInstallationDeleted } from "./useIsInstallationDeleted";

// Define the context value type
interface InstallIntegrationContextValue {
  integrationId: string;
  provider: string;
  integrationObj?: Integration | null;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  installation?: Installation;
  setInstallation: (installationObj: Installation) => void;
  resetInstallations: () => void;
  onInstallSuccess?: (installationId: string, config: Config) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
  onUninstallSuccess?: (installationId: string) => void;
  isIntegrationDeleted: boolean;
  setIntegrationDeleted: () => void;
  fieldMapping?: FieldMapping;
  resetComponent: () => void;
}
// Create a context to pass down the props
export const InstallIntegrationContext =
  createContext<InstallIntegrationContextValue>({
    integrationId: "",
    provider: "",
    integrationObj: undefined,
    consumerRef: "",
    consumerName: "",
    groupRef: "",
    groupName: "",
    installation: undefined,
    setInstallation: () => {},
    resetInstallations: () => {},
    onInstallSuccess: undefined,
    onUpdateSuccess: undefined,
    onUninstallSuccess: undefined,
    isIntegrationDeleted: false,
    setIntegrationDeleted: () => {},
    resetComponent: () => {},
  });

// Create a custom hook to access the props
export function useInstallIntegrationProps() {
  const context = useContext(InstallIntegrationContext);
  if (!context) {
    throw new Error(
      "useInstallIntegrationProps must be used within an InstallIntegrationProvider",
    );
  }
  return context;
}

interface InstallIntegrationProviderProps {
  integration: string; // integration name
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  children: React.ReactNode;
  onInstallSuccess?: (installationId: string, config: Config) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
  onUninstallSuccess?: (installationId: string) => void;
  fieldMapping?: FieldMapping;
  resetComponent: () => void;
}

// Wrap your parent component with the context provider
export function InstallIntegrationProvider({
  children,
  integration,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  onInstallSuccess,
  onUpdateSuccess,
  onUninstallSuccess,
  fieldMapping,
  resetComponent,
}: InstallIntegrationProviderProps) {
  const { integrations } = useIntegrationList();
  const { setError, isError, removeError } = useErrorState();
  const {
    isIntegrationDeleted,
    setIntegrationDeleted,
    resetIntegrationDeleted,
  } = useIsInstallationDeleted();

  const integrationObj = useMemo(
    () => findIntegrationFromList(integration, integrations || []),
    [integration, integrations],
  );
  const {
    data: installations,
    isLoading,
    isError: isInstallationError,
    error: installationError,
  } = useListInstallationsQuery(integration, groupRef);

  const installation = installations?.[0] || null; // there should only be one installation for mvp

  // resets the isIntegrationDeleted state when InstallIntegrationProps change
  useEffect(() => {
    resetIntegrationDeleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    integration,
    consumerRef,
    consumerName,
    groupRef,
    groupName,
    fieldMapping,
    // onInstallSuccess, onUpdateSuccess, onUninstallSuccess, fieldMapping, resetIntegrationDeleted
  ]);

  useEffect(() => {
    if (integrationObj === null && integrations?.length) {
      console.error(
        `Integration "${integration}" not found in integration list`,
      );
    }
  }, [integration, integrationObj, integrations]);

  useEffect(() => {
    if (isInstallationError) {
      setError(ErrorBoundary.INSTALLATION_LIST, integrationObj?.id || "");
      handleServerError(installationError);
    } else {
      removeError(ErrorBoundary.INSTALLATION_LIST, integrationObj?.id || "");
    }
  }, [
    isInstallationError,
    integrationObj,
    setError,
    removeError,
    installationError,
  ]);
  const queryClient = useQueryClient();

  // legacy reset function - remove when migrated all installation endpoints to react-query
  const resetInstallations = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["amp", "installations"] });
  }, [queryClient]);

  // updates cache with new installation object
  const setInstallation = useCallback(
    (installationObj: Installation) => {
      queryClient.setQueryData(["amp", "installations"], [installationObj]);
      queryClient.invalidateQueries({ queryKey: ["amp", "installations"] });
    },
    [queryClient],
  );

  const integrationErrorKey: string = integrationObj?.id || "";

  const props = useMemo(
    () => ({
      integrationId: integrationObj?.id || "",
      provider: integrationObj?.provider || "",
      integrationObj,
      consumerRef,
      consumerName,
      groupRef,
      groupName,
      installation: installation || undefined,
      setInstallation,
      resetInstallations,
      onInstallSuccess,
      onUpdateSuccess,
      onUninstallSuccess,
      isIntegrationDeleted,
      setIntegrationDeleted,
      fieldMapping,
      resetComponent,
    }),
    [
      integrationObj,
      consumerRef,
      consumerName,
      groupRef,
      groupName,
      installation,
      setInstallation,
      resetInstallations,
      onInstallSuccess,
      onUpdateSuccess,
      onUninstallSuccess,
      isIntegrationDeleted,
      setIntegrationDeleted,
      fieldMapping,
      resetComponent,
    ],
  );

  if (isLoading) {
    return <ComponentContainerLoading />;
  }

  if (integrationObj === null) {
    // if integration not found, return error message
    return (
      <ComponentContainerError
        message={`Integration "${integration}" not found`}
      />
    );
  }

  if (isError(ErrorBoundary.INSTALLATION_LIST, integrationErrorKey)) {
    const errorMessage =
      "Error retrieving installation information for integration " +
      `"${integrationObj?.name || "unknown"}"`;
    return <ComponentContainerError message={errorMessage} />;
  }

  return (
    <InstallIntegrationContext.Provider value={props}>
      {children}
    </InstallIntegrationContext.Provider>
  );
}

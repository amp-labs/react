/**
 * this page is wip: untested
 */
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "context/ErrorContextProvider";

import { onSaveReadCreateInstallation } from "../actions/read/onSaveReadCreateInstallation";
import { onSaveWriteCreateInstallation } from "../actions/write/onSaveWriteCreateInstallation";
import { WRITE_CONST } from "../nav/ObjectManagementNav/constant";
import { setHydrateConfigState } from "../state/utils";
import { validateFieldMappings } from "../utils";

import { ConfigureInstallationBase } from "./ConfigureInstallationBase";
import { useMutateInstallation } from "./useMutateInstallation";

// the config should be undefined for create flow
const UNDEFINED_CONFIG = undefined;

//  Create Installation Flow
export function CreateInstallation() {
  const {
    integrationId,
    groupRef,
    consumerRef,
    setInstallation,
    hydratedRevision,
    loading,
    selectedObjectName,
    selectedConnection,
    apiKey,
    projectId,
    resetBoundary,
    setErrors,
    setMutateInstallationError,
    getMutateInstallationError,
    resetMutateInstallationErrorState,
    resetConfigureState,
    objectConfigurationsState,
    resetPendingConfigurationState,
    configureState,
    onInstallSuccess,
    onNextIncompleteTab,
  } = useMutateInstallation();
  const [isLoading, setLoadingState] = useState<boolean>(false);

  const isWriteSelected = selectedObjectName === WRITE_CONST;

  const errorMsg = getMutateInstallationError(selectedObjectName);

  const resetState = useCallback(() => {
    resetBoundary(ErrorBoundary.MAPPING);
    if (hydratedRevision?.content && !loading && selectedObjectName) {
      setHydrateConfigState(
        hydratedRevision,
        UNDEFINED_CONFIG,
        selectedObjectName,
        resetConfigureState,
      );
    }
  }, [
    resetBoundary,
    hydratedRevision,
    loading,
    selectedObjectName,
    resetConfigureState,
  ]);

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    if (!configureState && hydratedRevision?.content && !loading) {
      resetState();
    }
  }, [
    configureState,
    objectConfigurationsState,
    hydratedRevision,
    loading,
    resetState,
  ]);

  const onSaveRead = () => {
    resetMutateInstallationErrorState();

    // check if fields with requirements are met
    const { requiredMapFields, selectedFieldMappings } =
      configureState?.read || {};
    const { errorList } = validateFieldMappings(
      requiredMapFields,
      selectedFieldMappings,
      setErrors,
    );
    if (errorList.length > 0) {
      return;
    } // skip if there are errors

    if (
      selectedObjectName &&
      selectedConnection?.id &&
      apiKey &&
      projectId &&
      integrationId &&
      groupRef &&
      consumerRef &&
      hydratedRevision
    ) {
      setLoadingState(true);
      const res = onSaveReadCreateInstallation(
        projectId,
        integrationId,
        groupRef,
        consumerRef,
        selectedConnection.id,
        selectedObjectName,
        apiKey,
        hydratedRevision,
        configureState,
        setMutateInstallationError(selectedObjectName),
        setInstallation,
        onInstallSuccess,
      );

      res.finally(() => {
        setLoadingState(false);
        resetPendingConfigurationState(selectedObjectName);
        onNextIncompleteTab();
      });
    } else {
      console.error(
        "CreateInstallallation - onSaveReadCreate: missing required props",
      );
    }
  };

  const onSaveWrite = () => {
    resetMutateInstallationErrorState();

    // check if fields with requirements are met
    if (
      selectedObjectName &&
      selectedConnection?.id &&
      apiKey &&
      projectId &&
      integrationId &&
      groupRef &&
      consumerRef &&
      hydratedRevision
    ) {
      setLoadingState(true);
      const res = onSaveWriteCreateInstallation(
        projectId,
        integrationId,
        groupRef,
        consumerRef,
        selectedConnection.id,
        apiKey,
        hydratedRevision,
        configureState,
        setMutateInstallationError(selectedObjectName),
        setInstallation,
        onInstallSuccess,
      );

      res.finally(() => {
        setLoadingState(false);
        resetPendingConfigurationState(selectedObjectName); // reset write pending/isModified state
        onNextIncompleteTab();
      });
    } else {
      console.error(
        "CreateInstallallation - onSaveWriteCreate: missing required props",
      );
    }
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (!isWriteSelected) {
      onSaveRead();
    } else {
      onSaveWrite();
    }
  };

  return (
    <ConfigureInstallationBase
      errorMsg={errorMsg}
      isCreateMode
      isLoading={isLoading}
      onSave={onSave}
      onReset={resetState}
    />
  );
}

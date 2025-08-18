import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "context/ErrorContextProvider";
import { Installation, Integration } from "services/api";
import { toInstallationConfigContentFromUpdate } from "src/headless/config/types";
import { useUpdateInstallation } from "src/headless/installation/useUpdateInstallation";

import { generateUpdateReadConfigFromConfigureState } from "../actions/read/onSaveReadUpdateInstallation";
import { generateUpdateWriteConfigFromConfigureState } from "../actions/write/onSaveWriteUpdateInstallation";
import { WRITE_CONST } from "../nav/ObjectManagementNav/constant";
import { setHydrateConfigState } from "../state/utils";
import { validateFieldMappings } from "../utils";

import { ConfigureInstallationBase } from "./ConfigureInstallationBase";
import { useMutateInstallation } from "./useMutateInstallation";

interface UpdateInstallationProps {
  installation: Installation;
  integrationObj: Integration;
}

//  Update Installation Flow
export function UpdateInstallation({ installation }: UpdateInstallationProps) {
  const {
    setInstallation,
    hydratedRevision,
    loading,
    selectedObjectName,
    resetBoundary,
    setErrors,
    setMutateInstallationError,
    getMutateInstallationError,
    resetConfigureState,
    resetPendingConfigurationState,
    configureState,
    onUpdateSuccess,
    onNextIncompleteTab,
  } = useMutateInstallation();

  const [isLoading, setLoadingState] = useState<boolean>(false);
  const { updateInstallation } = useUpdateInstallation();
  const isWriteSelected = selectedObjectName === WRITE_CONST;

  const errorMsg = getMutateInstallationError(selectedObjectName);

  // when no installation or config exists, render create flow
  const { config } = installation;

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision (contains full form)
  // 3. generate the configuration state from the hydrated revision and config

  const resetState = useCallback(() => {
    resetBoundary(ErrorBoundary.MAPPING);
    // set configurationState when hydratedRevision is loaded
    if (hydratedRevision?.content && !loading && selectedObjectName) {
      setHydrateConfigState(
        hydratedRevision,
        config,
        selectedObjectName,
        resetConfigureState,
      );
    }
  }, [
    resetBoundary,
    hydratedRevision,
    loading,
    selectedObjectName,
    config,
    resetConfigureState,
  ]);

  useEffect(() => {
    if (!configureState) {
      resetState();
    }
  }, [configureState, resetState]);

  const hydratedObject = useMemo(() => {
    const hydrated = hydratedRevision?.content?.read?.objects?.find(
      (obj) => obj?.objectName === selectedObjectName,
    );

    return hydrated;
  }, [hydratedRevision, selectedObjectName]);

  const onSaveRead = () => {
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
    }

    if (hydratedRevision && selectedObjectName && hydratedObject) {
      setLoadingState(true);

      const updateConfig = generateUpdateReadConfigFromConfigureState(
        configureState,
        selectedObjectName,
        hydratedObject,
        hydratedObject.schedule || "",
        hydratedRevision,
        hydratedObject.backfill,
      );

      if (
        !updateConfig.content ||
        // check if the config content is valid and allows to be converted to InstallationConfigContent
        !toInstallationConfigContentFromUpdate(updateConfig.content)
      ) {
        console.error("UpdateInstallation - invalid config content");
        setLoadingState(false);
        return;
      }

      updateInstallation({
        config: updateConfig.content,
        onSuccess: (installation) => {
          setInstallation(installation);
          onUpdateSuccess?.(installation.id, installation.config);
          setLoadingState(false);
          resetPendingConfigurationState(selectedObjectName);
          onNextIncompleteTab();
        },
        onError: (error) => {
          setMutateInstallationError(selectedObjectName)(error.message);
          setLoadingState(false);
        },
      });
    } else {
      console.error("UpdateInstallation - onSaveUpdate missing required props");
    }
  };

  const onSaveWrite = () => {
    if (selectedObjectName && hydratedRevision) {
      setLoadingState(true);

      const updateConfig = generateUpdateWriteConfigFromConfigureState(
        configureState,
        hydratedRevision,
      );

      if (
        !updateConfig.content ||
        // check if the config content is valid and allows to be converted to InstallationConfigContent
        !toInstallationConfigContentFromUpdate(updateConfig.content)
      ) {
        console.error("UpdateInstallation - invalid config content");
        setLoadingState(false);
        return;
      }

      updateInstallation({
        config: updateConfig.content,
        onSuccess: (installation) => {
          setInstallation(installation);
          onUpdateSuccess?.(installation.id, installation.config);
          setLoadingState(false);
          resetPendingConfigurationState(selectedObjectName);
          onNextIncompleteTab();
        },
        onError: (error) => {
          setMutateInstallationError(selectedObjectName)(error.message);
          setLoadingState(false);
        },
      });
    } else {
      console.error("UpdateInstallation - onSaveUpdate missing required props");
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
      onSave={onSave}
      onReset={resetState}
      isLoading={isLoading}
    />
  );
}

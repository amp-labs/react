import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { useApiKey } from '../../context/ApiKeyProvider';
import {
  ErrorBoundary,
  useErrorState,
} from '../../context/ErrorContextProvider';
import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { useProject } from '../../context/ProjectContext';
import { Installation, Integration } from '../../services/api';

import { onSaveUpdate } from './actions/onSaveUpdate';
import { useConfigureState } from './state/ConfigurationStateProvider';
import { useHydratedRevision } from './state/HydratedRevisionContext';
import { getConfigureState, setHydrateConfigState } from './state/utils';
import { ConfigureInstallationBase } from './ConfigureInstallationBase';
import { useSelectedObjectName } from './ObjectManagementNav';

interface UpdateInstallationProps {
  installation: Installation,
  integrationObj: Integration,
}

//  Update Installation Flow
export function UpdateInstallation(
  { installation, integrationObj }: UpdateInstallationProps,
) {
  const apiKey = useApiKey();
  const { setInstallation } = useInstallIntegrationProps();
  const { hydratedRevision, loading } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  const { projectId } = useProject();
  const [isLoading, setLoadingState] = useState<boolean>(false);

  // when no installation or config exists, render create flow
  const { config } = installation;

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision (contains full form)
  // 3. generate the configuration state from the hydrated revision and config
  const { resetBoundary, setErrors } = useErrorState();
  const {
    resetConfigureState,
    objectConfigurationsState,
    resetPendingConfigurationState,
  } = useConfigureState();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);
  const resetState = useCallback(
    () => {
      resetBoundary(ErrorBoundary.MAPPING);
      // set configurationState when hydratedRevision is loaded
      if (hydratedRevision?.content && !loading && selectedObjectName) {
        setHydrateConfigState(hydratedRevision, config, selectedObjectName, resetConfigureState);
      }
    },
    [resetBoundary, hydratedRevision, loading, selectedObjectName, config, resetConfigureState],
  );

  useEffect(() => {
    if (!configureState) { resetState(); }
  }, [configureState, resetState]);

  const hydratedObject = useMemo(() => {
    const hydrated = hydratedRevision?.content?.read?.standardObjects?.find(
      (
        obj,
      ) => obj?.objectName === selectedObjectName,
    );

    return hydrated;
  }, [hydratedRevision, selectedObjectName]);

  const onSave = (e: any) => {
    e.preventDefault();

    // check if fields with requirements are met
    const { requiredMapFields } = configureState;
    const fieldsWithRequirementsNotMet = requiredMapFields?.filter(
      (field) => !field.value,
    )
      || [];

    const errList = fieldsWithRequirementsNotMet.map((field) => field.mapToName);
    setErrors(ErrorBoundary.MAPPING, errList);

    // if requires fields are not met, set error fields and return
    if (fieldsWithRequirementsNotMet?.length) {
      console.error('required fields not met', fieldsWithRequirementsNotMet.map((field) => field.mapToDisplayName));
      return;
    }

    if (installation
      && selectedObjectName
      && apiKey
      && projectId
      && hydratedObject) {
      setLoadingState(true);
      const res = onSaveUpdate(
        projectId,
        integrationObj.id,
        installation.id,
        selectedObjectName,
        apiKey,
        configureState,
        setInstallation,
        hydratedObject,
      );

      res.finally(() => {
        setLoadingState(false);
        resetPendingConfigurationState(selectedObjectName);
      });
    } else {
      console.error('update installation props missing');
    }
  };

  return (
    <ConfigureInstallationBase
      onSave={onSave}
      onReset={resetState}
      isLoading={isLoading}
    />
  );
}

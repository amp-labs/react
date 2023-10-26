import {
  useCallback, useContext, useEffect, useMemo,
} from 'react';

import { ApiKeyContext } from '../../context/ApiKeyContext';
import {
  ErrorBoundary, resetBoundary, setErrors,
  useErrorState,
} from '../../context/ErrorContextProvider';
import { useHydratedRevision } from '../../context/HydratedRevisionContext';
import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { useProject } from '../../context/ProjectContext';
import { Installation, Integration } from '../../services/api';

import { onSaveUpdate } from './actions/onSaveUpdate';
import { useConfigureState } from './state/ConfigurationStateProvider';
import { getConfigureState, resetConfigurationState } from './state/utils';
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
  const { setInstallation } = useInstallIntegrationProps();
  const { hydratedRevision, loading } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  const apiKey = useContext(ApiKeyContext);
  const { projectId } = useProject();
  console.log(selectedObjectName)
  // when no installation or config exists, render create flow
  const { config } = installation;

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision (contains full form)
  // 3. generate the configuration state from the hydrated revision and config
  const { setErrorState } = useErrorState();
  const { setConfigureState, objectConfigurationsState } = useConfigureState();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);
  console.log("configureState", selectedObjectName, configureState)
  const resetState = useCallback(
    () => {
      resetBoundary(ErrorBoundary.MAPPING, setErrorState);
      // set configurationState when hydratedRevision is loaded
      const actions = hydratedRevision?.content?.actions;
      console.log("actions", actions)

      if (hydratedRevision?.content?.actions && !loading && selectedObjectName) {
        resetConfigurationState(hydratedRevision, config, selectedObjectName, setConfigureState);
      }
    },
    [
      hydratedRevision,
      loading,
      config,
      selectedObjectName,
      setConfigureState,
      setErrorState,
    ],
  );

  useEffect(() => {
    resetState();
  }, [resetState]);

  const { readActions, hydratedObject } = useMemo(() => {
    const actions = hydratedRevision?.content?.actions?.find(
      (
        action,
      ) => action?.type === 'read',
    );
    const hydrated = actions?.standardObjects?.find(
      (
        obj,
      ) => obj?.objectName === selectedObjectName,
    );

    return { readActions: actions, hydratedObject: hydrated };
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
    setErrors(ErrorBoundary.MAPPING, errList, setErrorState);

    // if requires fields are not met, set error fields and return
    if (fieldsWithRequirementsNotMet?.length) {
      console.error('required fields not met', fieldsWithRequirementsNotMet.map((field) => field.mapToDisplayName));
      return;
    }

    if (installation
      && selectedObjectName
      && apiKey
      && projectId
      && hydratedObject
      && readActions) {
      onSaveUpdate(
        projectId,
        integrationObj.id,
        installation.id,
        selectedObjectName,
        apiKey,
        configureState,
        setInstallation,
        hydratedObject,
        readActions?.schedule || '',
      );
    } else {
      console.error('update installation props missing');
    }
  };

  return (
    <ConfigureInstallationBase
      onSave={onSave}
      onReset={resetState}
    />
  );
}

/**
 * this page is wip: untested
 */
import {
  useCallback, useContext, useEffect, useState,
} from 'react';

import { ApiKeyContext } from '../../context/ApiKeyContext';
import { useConnections } from '../../context/ConnectionsContext';
import {
  ErrorBoundary, useErrorState,
} from '../../context/ErrorContextProvider';
import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { useProject } from '../../context/ProjectContext';

import { onSaveCreate } from './actions/onSaveCreate';
import { useConfigureState } from './state/ConfigurationStateProvider';
import { useHydratedRevision } from './state/HydratedRevisionContext';
import { getConfigureState, resetConfigurationState } from './state/utils';
import { ConfigureInstallationBase } from './ConfigureInstallationBase';
import { useSelectedObjectName } from './ObjectManagementNav';

// the config should be undefined for create flow
const UNDEFINED_CONFIG = undefined;

//  Create Installation Flow
export function CreateInstallation() {
  const {
    integrationId, groupRef, consumerRef, setInstallation,
  } = useInstallIntegrationProps();
  const { hydratedRevision, loading } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  const { selectedConnection } = useConnections();
  const apiKey = useContext(ApiKeyContext);
  const { projectId } = useProject();
  const { resetBoundary, setErrors } = useErrorState();
  const {
    setConfigureState,
    objectConfigurationsState,
    resetPendingConfigurationState,
  } = useConfigureState();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);
  const [isLoading, setLoadingState] = useState<boolean>(false);

  const resetState = useCallback(
    () => {
      resetBoundary(ErrorBoundary.MAPPING);
      if (hydratedRevision?.content && !loading && selectedObjectName) {
        resetConfigurationState(
          hydratedRevision,
          UNDEFINED_CONFIG,
          selectedObjectName,
          setConfigureState,
        );
      }
    },
    [hydratedRevision, loading, selectedObjectName, setConfigureState, resetBoundary],
  );

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    if (!configureState && hydratedRevision?.content && !loading) {
      resetState();
    }
  }, [configureState, objectConfigurationsState, hydratedRevision, loading, resetState]);

  const onSave = (e: any) => {
    e.preventDefault();

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

    if (selectedObjectName && selectedConnection?.id && apiKey && projectId
      && integrationId && groupRef && consumerRef && hydratedRevision) {
      setLoadingState(true);
      const res = onSaveCreate(
        projectId,
        integrationId,
        groupRef,
        consumerRef,
        selectedConnection.id,
        selectedObjectName,
        apiKey,
        hydratedRevision,
        configureState,
        setInstallation,
      );

      res.finally(() => {
        setLoadingState(false);
        resetPendingConfigurationState(selectedObjectName);
      });
    } else {
      console.error('OnSaveCreate: missing required props');
    }
  };

  return (
    <ConfigureInstallationBase
      isLoading={isLoading}
      onSave={onSave}
      onReset={resetState}
    />
  );
}

import { useCallback } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useConnections } from 'context/ConnectionsContextProvider';
import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';

import { useSelectedObjectName } from '../nav/ObjectManagementNav';
import { useObjectsConfigureState } from '../state/ConfigurationStateProvider';
import { useHydratedRevision } from '../state/HydratedRevisionContext';
import { getConfigureState } from '../state/utils';

/**
 * state hook for installation flows (Create/Update)
 * */
export const useMutateInstallation = () => {
  const {
    integrationId, groupRef, consumerRef, setInstallation, onInstallSuccess, onUpdateSuccess,
  } = useInstallIntegrationProps();
  const { hydratedRevision, loading } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  const { selectedConnection } = useConnections();
  const apiKey = useApiKey();
  const { projectId } = useProject();
  const {
    resetBoundary, setErrors, setError, getError,
  } = useErrorState();
  const {
    resetConfigureState, objectConfigurationsState, resetPendingConfigurationState,
  } = useObjectsConfigureState();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);

  /**
   * Error handling for installation mutation
   *
   * The error state is stored in the ErrorContextProvider, specifically for
   * ErrorBoundary.InstallationMutation
   *
   * The key for the error state is the objectName (i.e. the object being installed)
   * The value is the error message. This allows for errors to be stored for each object
   * as user may switch objects in the objectNav
   */
  const resetMutateInstallationErrorState = useCallback(() => {
    resetBoundary(ErrorBoundary.INSTALLATION_MUTATION);
  }, [resetBoundary]);

  // returns a function to set the error for a specific object
  const setMutateInstallationError = useCallback((objectName?: string) => {
    if (objectName) {
      return (error: string) => {
        setError(ErrorBoundary.INSTALLATION_MUTATION, objectName, error);
      };
    }
    return (error: string) => {
      console.error('objectName is required to set installation error: ', error);
    };
  }, [setError]);

  const getMutateInstallationError = useCallback(
    (objectName?: string) => {
      if (objectName) {
        return getError(ErrorBoundary.INSTALLATION_MUTATION, objectName);
      }
      return '';
    },
    [getError],
  );

  return {
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
    onUpdateSuccess,
  };
};

import { useApiKey } from '../../../context/ApiKeyContextProvider';
import { useConnections } from '../../../context/ConnectionsContextProvider';
import { useErrorState } from '../../../context/ErrorContextProvider';
import { useInstallIntegrationProps } from '../../../context/InstallIntegrationContextProvider';
import { useProject } from '../../../context/ProjectContextProvider';
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
  const { resetBoundary, setErrors } = useErrorState();
  const {
    resetConfigureState, objectConfigurationsState, resetPendingConfigurationState,
  } = useObjectsConfigureState();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState ?? {});

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
    resetConfigureState,
    objectConfigurationsState,
    resetPendingConfigurationState,
    configureState,
    onInstallSuccess,
    onUpdateSuccess,
  };
};

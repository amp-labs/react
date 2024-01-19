import { useProject } from '../../../../context/ProjectContext';
import { useSelectedObjectName } from '../../ObjectManagementNav';
import { useConfigureState } from '../../state/ConfigurationStateProvider';
import { getConfigureState } from '../../state/utils';

export const useFields = () => {
  const { appName } = useProject();
  const { objectConfigurationsState, setConfigureState } = useConfigureState();
  const { selectedObjectName } = useSelectedObjectName();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);

  return {
    appName,
    configureState,
    setConfigureState,
    selectedObjectName,
  };
};

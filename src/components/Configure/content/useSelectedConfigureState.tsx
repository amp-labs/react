import { useProject } from '../../../context/ProjectContextProvider';
import { useSelectedObjectName } from '../nav/ObjectManagementNav';
import { useObjectsConfigureState } from '../state/ConfigurationStateProvider';
import { getConfigureState } from '../state/utils';

/**
 *
 * @returns {object} configureState for the selected object in nav
 */
export const useSelectedConfigureState = () => {
  const { appName } = useProject();
  const { objectConfigurationsState, setConfigureState } = useObjectsConfigureState();
  const { selectedObjectName } = useSelectedObjectName();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);

  return {
    appName,
    configureState,
    setConfigureState,
    selectedObjectName,
  };
};

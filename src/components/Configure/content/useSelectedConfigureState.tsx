import { useProjectQuery } from "src/hooks/query";

import { useSelectedObjectName } from "../nav/ObjectManagementNav/ObjectManagementNavContext";
import { useObjectsConfigureState } from "../state/ConfigurationStateProvider";
import { getConfigureState } from "../state/utils";

/**
 *
 * @returns {object} configureState for the selected object in nav
 */
export const useSelectedConfigureState = () => {
  const { appName } = useProjectQuery();
  const { objectConfigurationsState, setConfigureState } =
    useObjectsConfigureState();
  const { selectedObjectName } = useSelectedObjectName();
  const configureState = getConfigureState(
    selectedObjectName || "",
    objectConfigurationsState,
  );

  return {
    appName,
    configureState,
    setConfigureState,
    selectedObjectName,
  };
};

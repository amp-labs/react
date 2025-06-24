import { capitalize } from "src/utils";

import { useSelectedObjectName } from "../nav/ObjectManagementNav/ObjectManagementNavContext";
import { useHydratedRevision } from "../state/HydratedRevisionContext";

/**
 * Hook to get the selected object and its display name
 * @returns {object} - The selected object and its display name
 */
export const useSelectedObject = () => {
  const { hydratedRevision } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();

  const selectedReadObject = hydratedRevision?.content?.read?.objects?.find(
    (obj) => obj.objectName === selectedObjectName,
  );

  const displayName =
    selectedReadObject?.displayName ||
    (selectedObjectName && capitalize(selectedObjectName));

  return {
    selectedObject: selectedReadObject,
    displayName,
  };
};

import {
  useValueMappingDirtyState,
  useValueMappingStore,
} from "../../../../stores/valueMappingStore";

/**
 * Hook that provides the dirty state for value mappings using Zustand store.
 * This replaces the old isValueMappingsModified logic from configure state.
 *
 * @returns object with dirty state and save snapshot function
 */
export const useValueMappingButtonState = () => {
  const isValueMappingsDirty = useValueMappingDirtyState();
  const saveSnapshot = useValueMappingStore((state) => state.saveSnapshot);

  return {
    isValueMappingsModified: isValueMappingsDirty,
    saveValueMappingSnapshot: saveSnapshot,
  };
};

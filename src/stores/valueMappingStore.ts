import isEqual from "lodash.isequal";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { debugZustandState } from "../components/Configure/content/debug/saveButtonDebug";

export interface ValueMappingState {
  // Current mappings: fieldName -> sourceValue -> targetValue
  mappings: Record<string, Record<string, string>>;
  // Saved snapshot for dirty state comparison
  savedMappings: Record<string, Record<string, string>>;

  // Actions
  updateMapping: (
    fieldName: string,
    sourceValue: string,
    targetValue: string,
  ) => void;
  saveSnapshot: () => void;
  resetToSaved: () => void;
  loadFromExternal: (mappings: Record<string, Record<string, string>>) => void;

  // Computed selectors
  isDirty: () => boolean;
  getFieldDirtyState: (fieldName: string) => boolean;
  getMappingForField: (fieldName: string) => Record<string, string>;
}

export const useValueMappingStore = create<ValueMappingState>()(
  subscribeWithSelector((set, get) => ({
    mappings: {},
    savedMappings: {},

    updateMapping: (
      fieldName: string,
      sourceValue: string,
      targetValue: string,
    ) =>
      set((state) => {
        const newMappings = { ...state.mappings };

        if (!newMappings[fieldName]) {
          newMappings[fieldName] = {};
        }

        if (targetValue === "" && newMappings[fieldName][sourceValue]) {
          // Remove the mapping if target value is empty
          delete newMappings[fieldName][sourceValue];
        } else {
          newMappings[fieldName][sourceValue] = targetValue;
        }

        debugZustandState("updateMapping", {
          fieldName,
          sourceValue,
          targetValue,
          newMappings,
          previousMappings: state.mappings,
          isDirtyAfter: !isEqual(newMappings, state.savedMappings),
        });

        return { mappings: newMappings };
      }),

    saveSnapshot: () =>
      set((state) => {
        const newSavedMappings = JSON.parse(JSON.stringify(state.mappings));
        debugZustandState("saveSnapshot", {
          mappings: state.mappings,
          newSavedMappings,
          wasDirty: !isEqual(state.mappings, state.savedMappings),
        });
        return { savedMappings: newSavedMappings };
      }),

    resetToSaved: () =>
      set((state) => ({
        mappings: JSON.parse(JSON.stringify(state.savedMappings)),
      })),

    loadFromExternal: (mappings: Record<string, Record<string, string>>) =>
      set((state) => {
        debugZustandState("loadFromExternal", {
          newMappings: mappings,
          previousMappings: state.mappings,
          previousSavedMappings: state.savedMappings,
        });
        return {
          mappings: JSON.parse(JSON.stringify(mappings)),
          savedMappings: JSON.parse(JSON.stringify(mappings)),
        };
      }),

    isDirty: () => {
      const { mappings, savedMappings } = get();
      return !isEqual(mappings, savedMappings);
    },

    getFieldDirtyState: (fieldName: string) => {
      const { mappings, savedMappings } = get();
      return !isEqual(
        mappings[fieldName] || {},
        savedMappings[fieldName] || {},
      );
    },

    getMappingForField: (fieldName: string) => {
      const { mappings } = get();
      return mappings[fieldName] || {};
    },
  })),
);

// Hook for easy dirty state subscription with debug logging
export const useValueMappingDirtyState = () => {
  const isDirty = useValueMappingStore((state) => state.isDirty());
  const mappings = useValueMappingStore((state) => state.mappings);
  const savedMappings = useValueMappingStore((state) => state.savedMappings);

  debugZustandState("isDirty", {
    isDirty,
    mappings,
    savedMappings,
    isEqual: isEqual(mappings, savedMappings),
  });

  return isDirty;
};

// Hook for field-specific dirty state
export const useFieldDirtyState = (fieldName: string) => {
  return useValueMappingStore((state) => state.getFieldDirtyState(fieldName));
};

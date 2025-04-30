import { Draft } from "immer";

import { ConfigureState } from "../../../types";

function setValueMappingProducer(
  draft: Draft<ConfigureState>,
  selectedObjectName: string,
  sourceValue: string,
  targetValue: string,
  fieldName: string,
) {
  // Ensure structure exists
  if (!draft.read) {
    return;
  }
  if (!draft.read.selectedValueMappings) {
    draft.read.selectedValueMappings = {};
  }

  if (!draft.read.selectedValueMappings[fieldName]) {
    draft.read.selectedValueMappings[fieldName] = {};
  }

  // Directly mutate the draft
  if (
    targetValue === "" &&
    draft.read.selectedValueMappings[fieldName][sourceValue]
  ) {
    delete draft.read.selectedValueMappings[fieldName][sourceValue];
  } else {
    draft.read.selectedValueMappings[fieldName][sourceValue] = targetValue;
  }
}

export function setValueMapping(
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    producer: (draft: Draft<ConfigureState>) => void,
  ) => void,
  sourceValue: string,
  targetValue: string,
  fieldName: string,
) {
  setConfigureState(selectedObjectName, (draft) =>
    setValueMappingProducer(
      draft,
      selectedObjectName,
      sourceValue,
      targetValue,
      fieldName,
    ),
  );
}

export function setValueMappingModified(
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    producer: (draft: Draft<ConfigureState>) => void,
  ) => void,
  isModified: boolean,
) {
  setConfigureState(selectedObjectName, (draft) => {
    if (draft.read) {
      draft.read.isValueMappingsModified = isModified;
    }
  });
}

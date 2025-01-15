import { Draft } from 'immer';

import { isFieldObjectEqual } from 'src/components/Configure/state/utils';

import { ConfigureState } from '../../../types';

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
    // eslint-disable-next-line no-param-reassign
    draft.read.selectedValueMappings = {};
  }

  if (!draft.read.selectedValueMappings[selectedObjectName]) {
    // eslint-disable-next-line no-param-reassign
    draft.read.selectedValueMappings[selectedObjectName] = {};
  }
  if (!draft.read.selectedValueMappings[selectedObjectName][fieldName]) {
    // eslint-disable-next-line no-param-reassign
    draft.read.selectedValueMappings[selectedObjectName][fieldName] = {};
  }

  // Directly mutate the draft
  // eslint-disable-next-line no-param-reassign
  draft.read.selectedValueMappings[selectedObjectName][fieldName][sourceValue] = targetValue;

  if (draft?.read && draft.read.selectedValueMappings) {
    const savedFields = draft.read.savedConfig.selectedValueMappings;
    // eslint-disable-next-line no-param-reassign
    const updatedFields = draft.read.selectedValueMappings[selectedObjectName];
    const isModified = !isFieldObjectEqual(savedFields, updatedFields);

    // Update the flag directly in the draft
    // eslint-disable-next-line no-param-reassign
    draft.read.isValueMappingsModified = isModified;
  }
}

export function setValueMapping(
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    producer: (draft: Draft<ConfigureState>) => void
  ) => void,
  sourceValue: string,
  targetValue: string,
  fieldName: string,
) {
  setConfigureState(selectedObjectName, (draft) => setValueMappingProducer(
    draft,
    selectedObjectName,
    sourceValue,
    targetValue,
    fieldName,
  ));
}

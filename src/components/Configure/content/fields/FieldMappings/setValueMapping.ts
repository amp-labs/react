import { Draft } from 'immer';

import { FieldMappingWithMappedValues } from 'src/components/Configure/InstallIntegration';

import { ConfigureState } from '../../../types';

function setValueMappingProducer(
  draft: Draft<ConfigureState>,
  selectedObjectName: string,
  sourceValue: string,
  targetValue: string,
  fieldName: string,
  field: FieldMappingWithMappedValues,
) {
  // Ensure structure exists
  if (!draft.read) {
    return;
  }
  if (!draft.read.selectedValueMappings) {
    // eslint-disable-next-line no-param-reassign
    draft.read.selectedValueMappings = {};
  }

  if (!draft.read.selectedValueMappings[fieldName]) {
    // eslint-disable-next-line no-param-reassign
    draft.read.selectedValueMappings[fieldName] = {};
  }

  // Directly mutate the draft
  // eslint-disable-next-line no-param-reassign
  draft.read.selectedValueMappings[fieldName][sourceValue] = targetValue;
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
  field: FieldMappingWithMappedValues,
) {
  setConfigureState(selectedObjectName, (draft) => setValueMappingProducer(
    draft,
    selectedObjectName,
    sourceValue,
    targetValue,
    fieldName,
    field,
  ));
}

export function setValueMappingModified(
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    producer: (draft: Draft<ConfigureState>) => void
  ) => void,
  isModified: boolean,
) {
  setConfigureState(selectedObjectName, (draft) => {
    if (draft.read) {
      // eslint-disable-next-line no-param-reassign
      draft.read.isValueMappingsModified = isModified;
    }
  });
}

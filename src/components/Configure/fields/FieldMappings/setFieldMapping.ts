import { Draft } from 'immer';

import { checkFieldsEquality, createSavedFields } from '../../state/utils';
import { ConfigureState } from '../../types';

function setFieldMappingProducer(
  draft: Draft<ConfigureState>,
  fieldKey: string,
  newValue: string,
) {
  const draftRequiredMapFields = draft?.requiredMapFields || [];
  const mapField = draftRequiredMapFields.find((field) => field?.mapToName === fieldKey);
  if (mapField) {
    mapField.value = newValue;
    const savedFields = draft.savedConfig.requiredMapFields;
    const updatedFields = createSavedFields(draftRequiredMapFields);
    const isModified = !checkFieldsEquality(savedFields, updatedFields);
    // immer exception if we try to set a value
    // eslint-disable-next-line no-param-reassign
    draft.isRequiredMapFieldsModified = isModified;
  }
}

export function setFieldMapping(
  selectedObjectName: string,
  setConfigureState: (objectName: string,
    producer: (draft: Draft<ConfigureState>) => void) => void,
  fieldKey: string,
  newValue: string,
) {
  setConfigureState(
    selectedObjectName,
    (draft) => setFieldMappingProducer(draft, fieldKey, newValue),
  );
}

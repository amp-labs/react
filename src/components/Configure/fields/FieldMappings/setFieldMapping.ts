import { Draft } from 'immer';

import { checkFieldsEquality, createSavedFields } from '../../state/utils';
import { ConfigureState } from '../../types';

export function setFieldMapping(
  selectedObjectName: string,
  setConfigureState: (objectName: string,
    producer: (draft: Draft<ConfigureState>) => void) => void,
  fieldKey: string,
  newValue: string,
) {
  setConfigureState(selectedObjectName, (currentConfigureStateDraft: Draft<ConfigureState>) => {
    let isUpdated = false;
    const draftRequiredMapFields = currentConfigureStateDraft?.requiredMapFields || [];
    const mapField = draftRequiredMapFields.find((field) => field?.mapToName === fieldKey);
    if (mapField) {
      isUpdated = true;
      mapField.value = newValue;
    }
    if (isUpdated) {
      const savedFields = currentConfigureStateDraft.savedConfig.requiredMapFields;
      const updatedFields = createSavedFields(draftRequiredMapFields);
      const isModified = !checkFieldsEquality(savedFields, updatedFields);
      // immer exception if we try to set a value
      // eslint-disable-next-line no-param-reassign
      currentConfigureStateDraft.isRequiredMapFieldsModified = isModified;
    }
  });
}

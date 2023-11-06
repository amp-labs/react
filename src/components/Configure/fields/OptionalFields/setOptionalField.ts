import { Draft } from 'immer';

import { checkFieldsEquality } from '../../state/utils';
import { ConfigureState } from '../../types';

export function setOptionalField(
  selectedObjectName: string,
  setConfigureState: (objectName: string,
    producer: (draft: Draft<ConfigureState>) => void) => void,
  fieldKey: string,
  checked: boolean,
) {
  setConfigureState(selectedObjectName, (currentConfigureStateDraft: Draft<ConfigureState>) => {
    const draftSelectedOptionalFields = currentConfigureStateDraft?.selectedOptionalFields || {};
    draftSelectedOptionalFields[fieldKey] = checked;
    if (!checked) { delete draftSelectedOptionalFields[fieldKey]; } // remove key if unchecked

    // Compare saved fields from updated fields
    const savedOptionalFields = currentConfigureStateDraft.savedConfig?.optionalFields;

    // Check if the optionalFields are modified
    const isModified = !checkFieldsEquality(savedOptionalFields, draftSelectedOptionalFields);

    // immer exception if we try to set a value
    // eslint-disable-next-line no-param-reassign
    currentConfigureStateDraft.isRequiredMapFieldsModified = isModified;
  });
}

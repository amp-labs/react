import { Draft } from 'immer';

import { checkFieldsEquality } from '../../state/utils';
import { ConfigureState } from '../../types';

function setOptionalFieldProducer(
  draft: Draft<ConfigureState>,
  fieldKey: string,
  checked: boolean,
) {
  const draftSelectedOptionalFields = draft?.selectedOptionalFields || {};
  draftSelectedOptionalFields[fieldKey] = checked;
  const savedFields = draft.savedConfig.optionalFields;
  const updatedFields = draftSelectedOptionalFields;
  const isModified = !checkFieldsEquality(savedFields, updatedFields);
  // immer exception if we try to set a value
  // eslint-disable-next-line no-param-reassign
  draft.isOptionalFieldsModified = isModified;
}

export function setOptionalField(
  selectedObjectName: string,
  setConfigureState: (objectName: string,
    producer: (draft: Draft<ConfigureState>) => void) => void,
  fieldKey: string,
  checked: boolean,
) {
  setConfigureState(
    selectedObjectName,
    (draft) => setOptionalFieldProducer(draft, fieldKey, checked),
  );
}

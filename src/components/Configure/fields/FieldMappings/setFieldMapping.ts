import { Draft } from 'immer';

import { isFieldObjectEqual } from '../../state/utils';
import { ConfigureState } from '../../types';

function setFieldMappingProducer(
  draft: Draft<ConfigureState>,
  fieldKey: string,
  newValue: string,
) {
  const draftRequiredMapFields = draft?.selectedFieldMappings || {};
  draftRequiredMapFields[fieldKey] = newValue;
  const savedFields = draft.savedConfig.requiredMapFields;
  const updatedFields = draftRequiredMapFields;
  const isModified = !isFieldObjectEqual(savedFields, updatedFields);
  // immer exception if we try to set a value
  // eslint-disable-next-line no-param-reassign
  draft.isRequiredMapFieldsModified = isModified;
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

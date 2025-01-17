import { Draft } from 'immer';

import { isFieldObjectEqual } from '../../../state/utils';
import { ConfigureState } from '../../../types';

export type MappingFields = {
  field: string
  value: string | null
};

function setFieldMappingProducer(
  draft: Draft<ConfigureState>,
  fields: Array<MappingFields>,
) {
  const draftRequiredMapFields = draft?.read?.selectedFieldMappings || {};

  fields.forEach((mapping) => {
    const { field, value } = mapping;
    if (value === null) {
      delete draftRequiredMapFields[field];
    } else {
      draftRequiredMapFields[field] = value;
    }
  });

  if (draft?.read) {
    const savedFields = draft.read.savedConfig.requiredMapFields;
    const updatedFields = draftRequiredMapFields;
    const isModified = !isFieldObjectEqual(savedFields, updatedFields);
    // immer exception if we try to set a value
    // eslint-disable-next-line no-param-reassign
    draft.read.isRequiredMapFieldsModified = isModified;
  }
}

export function setFieldMapping(
  selectedObjectName: string,
  setConfigureState: (objectName: string,
    producer: (draft: Draft<ConfigureState>) => void) => void,
  fields: Array<MappingFields>,
) {
  setConfigureState(
    selectedObjectName,
    (draft) => setFieldMappingProducer(draft, fields),
  );
}

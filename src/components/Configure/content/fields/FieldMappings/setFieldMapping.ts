import { Draft } from "immer";

import { isFieldObjectEqual } from "../../../state/utils";
import { ConfigureState } from "../../../types";

export type MappingFields = {
  field: string;
  value: string | null;
};

function setFieldMappingProducer(
  draft: Draft<ConfigureState>,
  fields: Array<MappingFields>,
) {
  const draftRequiredMapFields = draft?.read?.selectedFieldMappings || {};

  fields.forEach((mapping) => {
    const { field, value } = mapping;
    if (value === null) {
      // Get the current field name before deleting the mapping
      const currentFieldName = draftRequiredMapFields[field];
      delete draftRequiredMapFields[field];

      // Clear corresponding value mappings when field mapping is cleared
      // This ensures value mapping local state is cleared when UI is hidden
      if (currentFieldName && draft?.read?.selectedValueMappings) {
        if (draft.read.selectedValueMappings[currentFieldName]) {
          delete draft.read.selectedValueMappings[currentFieldName];
        }
      }
    } else {
      const previousFieldName = draftRequiredMapFields[field];
      draftRequiredMapFields[field] = value;

      // Clear value mappings for the previous field name if it changed
      if (
        previousFieldName &&
        previousFieldName !== value &&
        draft?.read?.selectedValueMappings
      ) {
        if (draft.read.selectedValueMappings[previousFieldName]) {
          delete draft.read.selectedValueMappings[previousFieldName];
        }
      }
    }
  });

  if (draft?.read) {
    const savedFields = draft.read.savedConfig.requiredMapFields;
    const updatedFields = draftRequiredMapFields;
    const isModified = !isFieldObjectEqual(savedFields, updatedFields);
    // immer exception if we try to set a value

    draft.read.isRequiredMapFieldsModified = isModified;
  }
}

export function setFieldMapping(
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    producer: (draft: Draft<ConfigureState>) => void,
  ) => void,
  fields: Array<MappingFields>,
) {
  setConfigureState(selectedObjectName, (draft) =>
    setFieldMappingProducer(draft, fields),
  );
}
